/* Penyimpanan lokal, backup, dan sinkronisasi Google untuk GeoLog. */
const GEOLOG_STORE = 'geolog-bmkg-data-v1';
const GEOLOG_CONFIG = 'geolog-bmkg-config-v1';

const geoSnapshot = () => ({ version: 1, savedAt: new Date().toISOString(), logs, assets, tickets, handovers });
const geoSave = () => localStorage.setItem(GEOLOG_STORE, JSON.stringify(geoSnapshot()));
const geoConfig = () => { try { return JSON.parse(localStorage.getItem(GEOLOG_CONFIG)) || {}; } catch { return {}; } };

function geoRestore() {
  try {
    const data = JSON.parse(localStorage.getItem(GEOLOG_STORE));
    if (!data) return;
    if (Array.isArray(data.logs)) logs = data.logs;
    if (Array.isArray(data.assets)) assets = data.assets;
    if (Array.isArray(data.tickets)) tickets = data.tickets;
    if (Array.isArray(data.handovers)) handovers = data.handovers;
    dashboard(); logbook(); handover(); assetsPage(); ticketsPage();
    $('#ticketCount').textContent = tickets.filter(t => t.status !== 'Selesai').length;
  } catch { console.warn('Backup GeoLog tidak dapat dipulihkan.'); }
}

function geoDownload() {
  const url = URL.createObjectURL(new Blob([JSON.stringify(geoSnapshot(), null, 2)], { type: 'application/json' }));
  Object.assign(document.createElement('a'), { href: url, download: `backup-geolog-${new Date().toISOString().slice(0, 10)}.json` }).click();
  URL.revokeObjectURL(url);
}

function geoSettings() {
  if (!$('#settings') || $('#geologDataPanel')) return;
  const configured = !!geoConfig().apiUrl;
  $('#settings').insertAdjacentHTML('beforeend', `<article id="geologDataPanel" class="panel mt-5 lg:col-span-3"><h3 class="font-bold">Data, Backup & Sinkronisasi</h3><p class="mt-1 text-sm text-slate-500">Data tersimpan otomatis di browser ini. Hubungkan Google Apps Script untuk mencadangkan logbook ke Google Sheets dan foto ke Drive.</p><div class="mt-4 flex flex-wrap gap-2"><button id="geoBackup" class="btn-secondary">⇩ Unduh backup</button><label class="btn-secondary cursor-pointer">⇧ Pulihkan backup<input id="geoRestore" class="hidden" type="file" accept="application/json"></label><button id="geoCloud" class="btn-primary">☁ Pengaturan Google</button></div><p class="mt-3 text-xs ${configured ? 'text-emerald-600' : 'text-amber-600'}">${configured ? 'Google Apps Script sudah dikonfigurasi.' : 'Belum terhubung ke Google; data tersimpan lokal.'}</p></article>`);
  $('#geoBackup').onclick = geoDownload;
  $('#geoCloud').onclick = geoCloudDialog;
  $('#geoRestore').onchange = geoImport;
}

function geoCloudDialog() {
  const apiUrl = geoConfig().apiUrl || '';
  modal(`<p class="eyebrow">GOOGLE SHEETS & DRIVE</p><h3 class="text-xl font-bold">Sinkronisasi Cloud</h3><p class="mt-2 text-sm text-slate-500">Tempel URL Web App Google Apps Script yang berakhir dengan <code>/exec</code>.</p><form id="geoCloudForm" class="mt-4 grid gap-3"><input class="field" name="apiUrl" required type="url" value="${esc(apiUrl)}" placeholder="https://script.google.com/macros/s/.../exec"><button class="btn-primary">Simpan pengaturan</button></form>`);
}

function geoImport(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { try { const data = JSON.parse(reader.result); if (!Array.isArray(data.logs)) throw Error(); localStorage.setItem(GEOLOG_STORE, JSON.stringify(data)); location.reload(); } catch { toast('File backup GeoLog tidak valid.'); } };
  reader.readAsText(file);
}

async function geoSendLog(log, file) {
  const { apiUrl } = geoConfig(); if (!apiUrl) return;
  let attachment = null;
  if (file?.size) {
    if (file.size > 4 * 1024 * 1024) throw Error('Foto maksimal 4 MB.');
    attachment = await new Promise((ok, bad) => { const r = new FileReader(); r.onload = () => ok({ name: file.name, type: file.type, base64: String(r.result).split(',')[1] }); r.onerror = bad; r.readAsDataURL(file); });
  }
  await fetch(apiUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'createLog', log, attachment }) });
}

geoRestore(); geoSave();
document.addEventListener('submit', event => {
  const form = event.target;
  if (form.id === 'geoCloudForm') { event.preventDefault(); localStorage.setItem(GEOLOG_CONFIG, JSON.stringify({ apiUrl: new FormData(form).get('apiUrl').trim() })); $('#modalRoot').innerHTML = ''; geoSettings(); toast('Pengaturan Google disimpan.'); return; }
  if (!['logForm', 'handoverForm', 'assetForm', 'ticketForm'].includes(form.id)) return;
  const file = form.querySelector('input[type=file]')?.files[0];
  setTimeout(async () => { geoSave(); if (form.id === 'logForm' && logs[0]) try { await geoSendLog(logs[0], file); if (geoConfig().apiUrl) toast('Logbook disimpan dan dikirim ke Google.'); } catch (err) { toast(err.message || 'Data lokal tersimpan, sinkronisasi Google gagal.'); } }, 0);
});
document.addEventListener('click', () => setTimeout(geoSave, 0));
setInterval(() => { if (location.hash === '#settings') geoSettings(); }, 400);

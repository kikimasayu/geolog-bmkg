/* Salin ke script.google.com. Ganti kedua ID, lalu Deploy sebagai Web app dan
   masukkan URL /exec hasil deploy pada menu Pengaturan LogiTrack. */
const SHEET_ID = 'GANTI_DENGAN_ID_GOOGLE_SHEET';
const DRIVE_FOLDER_ID = 'GANTI_DENGAN_ID_FOLDER_DRIVE';

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(['Waktu', 'Judul', 'Lokasi / Status', 'Bukti Drive']);
  let attachmentUrl = '';
  if (payload.attachment && payload.attachment.base64) {
    const bytes = Utilities.base64Decode(payload.attachment.base64);
    const blob = Utilities.newBlob(bytes, payload.attachment.type || 'application/octet-stream', payload.attachment.name);
    attachmentUrl = DriveApp.getFolderById(DRIVE_FOLDER_ID).createFile(blob).getUrl();
  }
  sheet.appendRow([new Date(), payload.log.title, payload.log.meta, attachmentUrl]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true, attachmentUrl })).setMimeType(ContentService.MimeType.JSON);
}

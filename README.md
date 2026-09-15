# LogiTrack — Logbook Teknisi TSI

Prototipe antarmuka modern untuk pencatatan pekerjaan teknisi. Dibuat dengan HTML, CSS, dan JavaScript murni sehingga dapat langsung di-host di GitHub Pages.

## Fitur versi awal

- Dashboard ringkasan pekerjaan dan progres mingguan
- Sidebar dengan menu dashboard, logbook, tugas, jadwal, aset, tim, laporan, dan pengaturan
- Pencarian logbook
- Formulir tambah logbook dengan lampiran bukti pekerjaan
- Penyimpanan lokal otomatis di browser sebagai cadangan
- Integrasi opsional Google Sheets dan Google Drive melalui Google Apps Script
- Unduh data logbook sebagai CSV serta Cetak / Simpan sebagai PDF
- Dark mode dan navigasi responsif untuk ponsel

## Menjalankan secara lokal

Buka `index.html` langsung di browser, atau gunakan ekstensi Live Server di VS Code.

## Publikasi ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `logitrack-teknisi`.
2. Unggah seluruh file proyek ini ke repository tersebut.
3. Di GitHub, buka **Settings** → **Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**, lalu pilih branch `main` dan folder `/(root)`.
5. Simpan. GitHub akan memberikan tautan situs Anda dalam beberapa menit.

## Menghubungkan Google Sheets dan Google Drive

1. Buat satu Google Sheet kosong dan satu folder Google Drive untuk bukti pekerjaan.
2. Salin ID Sheet serta ID folder dari URL masing-masing.
3. Buka [Google Apps Script](https://script.google.com/), buat proyek baru, lalu salin isi `google-apps-script.js` ke editor.
4. Ganti `SHEET_ID` dan `DRIVE_FOLDER_ID` dengan ID yang sudah disalin.
5. Pilih **Deploy → New deployment → Web app**. Atur akses sesuai kebijakan organisasi, lalu salin URL yang berakhiran `/exec`.
6. Di aplikasi LogiTrack, buka menu **Pengaturan**, tempel URL tersebut, lalu simpan.

Setiap logbook baru akan tetap tersimpan lokal. Ketika koneksi Google sudah aktif, data yang sama juga dikirim ke Sheet dan lampiran diunggah ke folder Drive.

> Untuk aplikasi produksi dengan banyak teknisi, langkah berikutnya yang disarankan adalah autentikasi pengguna dan database yang memiliki aturan akses per peran.

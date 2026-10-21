# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
# smart-card-prm-pbl
Aplikasi Smart Business Card &amp; Professional Relationship Management (PRM) merupakan aplikasi berbasis web responsif (mobile-friendly) yang memungkinkan pengguna membuat, membagikan, menyimpan, dan mengelola kartu nama digital serta relasi profesional.

## Kebutuhan Fungsional Tambahan (PRM Notifications)

### FR-PRM-04: Notifikasi Email Otomatis & Alasan Status Janji Temu
Sistem memiliki kemampuan untuk mengirimkan notifikasi email secara otomatis ke alamat email pihak eksternal saat status pengajuan janji temu dikonfirmasi (**Disetujui / Ditolak**).

1. **Alur & Tahapan Kerja (Workflow):**
   - **Langkah 1 (Pengajuan):** Pihak eksternal mengajukan janji temu melalui tautan/scan kartu nama digital dan mencantumkan alamat email aktif beserta agenda pertemuan.
   - **Langkah 2 (Peninjauan Masuk):** Pengajuan masuk ke halaman **Kelola PRM** pengguna / host.
   - **Langkah 3 (Pengambilan Keputusan & Input Alasan):** Host menekan tombol **Setujui** atau **Tolak**. Sistem menampilkan modal interaktif untuk menginputkan alasan/catatan resmi (misal: link Google Meet/ruang rapat untuk disetujui, atau alasan bentrok jadwal untuk ditolak).
   - **Langkah 4 (Pengiriman Email Otomatis):** Sistem memproses pembaruan status dan secara otomatis mengirimkan email notifikasi ke alamat email pihak eksternal berisi status keputusan dan alasan dari host.
   - **Langkah 5 (Pencatatan Riwayat):** Riwayat keputusan dan status pengiriman email tercatat di menu **Riwayat PRM**.

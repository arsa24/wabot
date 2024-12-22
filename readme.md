# Wabot - WhatsApp Bot

## Deskripsi

Wabot adalah bot WhatsApp berbasis Node.js yang dirancang untuk berbagai keperluan otomatisasi seperti membalas pesan otomatis, menjalankan perintah tertentu, dan integrasi dengan API pihak ketiga.

## Fitur

- **Respon Otomatis:** Membalas pesan dengan aturan yang telah ditentukan.
- **Dukungan Multi-Command:** Jalankan perintah langsung dari WhatsApp.
- **Integrasi API:** Mendukung integrasi API seperti OpenAI untuk menghasilkan balasan cerdas.
- **Keamanan Data:** Mengutamakan privasi dan keamanan.

## Instalasi

Ikuti langkah-langkah berikut untuk menginstal bot:

1. Clone repository ini:

   ```bash
   git clone https://github.com/arsa24/wabot.git
   cd wabot
   ```

2. Instal dependensi yang diperlukan:
   ```bash
   npm install
   ```

## Konfigurasi:

Tambahkan file `config.js` di root projek. Lalu salin isi yang ada di file `config.example.js` dan tempel ke file `config.js` dan silahkan sesuaikan isinya.

## Jalankan Projek

Terdapat beberapa opsi untuk menjalankan projek ini:

1. QR Code:
   Jika anda ingin mengkoneksikan bot dengean Whatsapp anda menggunakan QR Code, jalankan perintah berikut:

   ```bash
   npm start
   ```

2. Pairing Code:
   Jika anda ingin mengkoneksikan bot dengean Whatsapp anda menggunakan Pairing Code, jalankan perintah berikut:

   ```bash
   npm run use-pairing-code
   ```

3. Jalankan dengan PM2:
   Gunakan perintah ini jika anda ingin bisa menggunakan fitur restart pada bot.

   ```bash
   npm run start-pm2
   ```

## Kontribusi

Kontribusi sangat diterima! Silakan buat pull request atau laporkan masalah melalui [Issues](https://github.com/arsa24/wabot/issues).

## Lisensi

ISC License

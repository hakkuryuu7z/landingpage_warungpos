# 🚀 Panduan Deploy Docker VPS - Landing Page Warung POS

Dokumen ini menjelaskan cara deploy folder `landing` ke VPS menggunakan Docker Compose.

---

## 📌 Alokasi Port VPS

Berdasarkan status container Docker di VPS Anda:
* **Port 80**: Digunakan oleh `wa_blast_nginx`
* **Port 8081**: Digunakan oleh `portfolio-nginx`
* **Port 9000**: Digunakan oleh `portainer`
* **Port 3000**: Digunakan oleh `wa_blast_engine`
* **Port 3001**: Digunakan oleh `uptime-kuma`
* **Port 5001**: Digunakan oleh `generator-licence`
* **Port 8085**: Digunakan oleh `monitor-dashdot`

✅ **Port Terpilih**: **`8082`** (Host Port).
* Akses langsung VPS: `http://IP_VPS_ANDA:8082`

---

## 🛠️ Langkah-Langkah Deployment di VPS

### 1. Upload Folder `landing` ke VPS
Copy atau upload seluruh isi folder `landing/` ke VPS Anda (misalnya ke `/var/www/landing` atau `/var/www/pos-landing`):

Contoh struktur di VPS:
```text
/var/www/landing/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── index.html
├── manual.html
├── script.js
├── styles.css
├── latest.json
├── latest.js
├── assets/
└── downloads/
```

### 2. Jalankan Docker Compose
Masuk ke folder `landing` di VPS dan jalankan Docker Compose:

```bash
cd /var/www/landing
docker compose up -d --build
```

Cek status container:
```bash
docker ps | grep warungpos-landing
```

---

## 🌐 Menghubungkan ke Domain (Cloudflare Tunnel / Reverse Proxy)

### Menggunakan Cloudflare Tunnel (`cloudflared`):
1. Buka [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/).
2. Masuk ke **Networks** -> **Tunnels** -> Pilih Tunnel VPS Anda -> Edit.
3. Tambahkan **Public Hostname**:
   * **Subdomain**: `pos` (atau nama pilihan Anda)
   * **Domain**: `domainanda.com`
   * **Service Type**: `HTTP`
   * **URL**: `localhost:8082`
4. Simpan. HTTPS otomatis aktif via Cloudflare.

---

## ⚡ Auto-Publish Rilis Baru dari Komputer Lokal

Di komputer lokal (projek Electron), buka `scripts/publish-release.mjs`:
```javascript
const VPS_CONFIG = {
  ENABLED: true,
  USER: 'root',
  IP: '123.45.67.89', // Masukkan IP VPS Anda
  PATH: '/var/www/landing/' // Path folder landing di VPS tempat docker compose jalan
};
```

Setiap kali Anda menjalankan `npm run dist` di lokal, file rilis `.exe` baru dan metadata akan di-upload via SCP ke `/var/www/landing/`. Karena Docker Nginx me-mount folder tersebut, **update langsung live seketika tanpa perlu restart container Docker di VPS!**

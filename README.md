# 🤖 Gemma AI Discord Bot
![Logo](https://pplx-res.cloudinary.com/image/upload/v1741814663/url_uploads/gemma-header.width-1200.format-webp_at957e.jpg)

Bot Discord sederhana yang memungkinkan pengguna berinteraksi dengan AI Gemini dari Google melalui perintah di saluran tertentu.

---

## 🚀 Fitur

- Chatting dengan AI melalui perintah `!chat`
- Cooldown antar pengguna (default: 3 detik)
- Otomatis membagi atau mengirim respons panjang sebagai file `.txt`
- Bantuan dengan `!chat help`

---

## 🛠️ Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/bariqadyatam/bot_ai_discord.git
cd bot-gemini
```

### 2. Install Dependensi

```bash
npm install
```

###  Buat File .env
```.env
DISCORD_TOKEN=your_discord_bot_token_here
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_CHANNEL_ID=your_channel_id_here
```

### 4. Jalankan Bot

```bash
node index.js
```

## 💬 Cara Menggunakan
Di channel yang telah ditentukan:
```
!chat Apa itu teori relativitas?
```






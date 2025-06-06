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

## License
 
The MIT License (MIT)

Copyright (c) 2015 Chris Kibble

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.




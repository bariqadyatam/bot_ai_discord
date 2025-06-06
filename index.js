require('dotenv').config();
const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Konfigurasi
const config = {
  prefix: '!chat',
  cooldown: 3000, // 3 detik
  maxCharPerMessage: 2000,
  maxTotalResponse: 15000, // Batas total karakter sebelum dikirim sebagai file
  allowAttachments: true // Mengizinkan pengiriman sebagai file
};

// Inisialisasi AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemma-3n-e4b-it" });

// Inisialisasi Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Sistem Cooldown
const userCooldowns = new Map();

// Fungsi untuk memisahkan teks panjang
function splitLongText(text, maxLength = config.maxCharPerMessage) {
  if (text.length <= maxLength) return [text];
  
  const chunks = [];
  let currentChunk = '';
  const paragraphs = text.split('\n\n');
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 2 > maxLength) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

// Fungsi untuk mengirim pesan panjang
async function sendLongResponse(message, content) {
  // Jika konten pendek, kirim langsung
  if (content.length <= config.maxCharPerMessage) {
    return message.reply(content);
  }

  // Jika melebihi batas total, kirim sebagai file
  if (content.length > config.maxTotalResponse && config.allowAttachments) {
    const buffer = Buffer.from(content, 'utf-8');
    const attachment = new AttachmentBuilder(buffer)
      .setName('response.txt');
    
    return message.reply({
      content: 'Respons terlalu panjang, berikut file teksnya:',
      files: [attachment]
    });
  }

  // Jika sedang (2000-15000 karakter), split menjadi beberapa pesan
  const chunks = splitLongText(content);
  
  try {
    // Kirim chunk pertama sebagai reply
    await message.reply(chunks[0]);
    
    // Kirim sisanya sebagai follow-up dengan delay
    for (let i = 1; i < chunks.length; i++) {
      await message.channel.send(chunks[i]);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay 500ms
    }
  } catch (error) {
    console.error('Error sending chunks:', error);
    throw error;
  }
}

// Event ketika bot ready
client.once('ready', () => {
  console.log(`🤖 Bot ${client.user.tag} siap digunakan!`);
  console.log(`🔹 Prefix: ${config.prefix}`);
  console.log(`🔹 Channel: ${process.env.ALLOWED_CHANNEL_ID}`);
});

// Event ketika ada pesan baru
client.on('messageCreate', async message => {
  // Abaikan pesan dari bot atau bukan di channel yang ditentukan
  if (message.author.bot || message.channel.id !== process.env.ALLOWED_CHANNEL_ID) return;
  
  // Cek apakah pesan dimulai dengan prefix
  if (!message.content.startsWith(config.prefix)) return;

  // Handle perintah help
  const prompt = message.content.slice(config.prefix.length).trim();
  if (!prompt || prompt.toLowerCase() === 'help') {
    return message.reply({
      embeds: [{
        title: '🛟 Bantuan Gemini AI Bot',
        description: `Gunakan \`${config.prefix} [pertanyaan]\` untuk berinteraksi dengan AI`,
        color: 0x5865F2,
        fields: [
          { name: '📝 Contoh', value: `\`${config.prefix} Jelaskan teori relativitas\`` },
          { name: '⏱️ Cooldown', value: `${config.cooldown/1000} detik`, inline: true },
          { name: '📁 File', value: 'Respons panjang otomatis jadi file', inline: true }
        ],
        footer: { text: `Bot aktif sejak ${new Date().toLocaleString()}` }
      }]
    });
  }

  // Cek cooldown
  if (userCooldowns.has(message.author.id)) {
    const lastTime = userCooldowns.get(message.author.id);
    const remainingTime = config.cooldown - (Date.now() - lastTime);
    
    if (remainingTime > 0) {
      return message.reply(`⌛ Tunggu ${Math.ceil(remainingTime/1000)} detik lagi sebelum menggunakan ${config.prefix} lagi.`);
    }
  }
  userCooldowns.set(message.author.id, Date.now());

  try {
    // Tampilkan typing indicator
    await message.channel.sendTyping();
    
    // Dapatkan respons dari Gemini AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Bersihkan teks jika perlu
    text = text.trim();
    if (!text) throw new Error('Empty response from AI');
    
    // Kirim respons
    await sendLongResponse(message, text);
    
  } catch (error) {
    console.error('Error:', error);
    
    let errorMessage = '❌ Terjadi kesalahan saat memproses permintaan.';
    if (error.message.includes('SAFETY')) {
      errorMessage = '🚫 Permintaan Anda ditolak oleh filter keamanan Gemini.';
    } else if (error.message.includes('429')) {
      errorMessage = '🔄 Terlalu banyak permintaan, silakan coba lagi nanti.';
    } else if (error.message.includes('Empty response')) {
      errorMessage = '🤖 Tidak mendapatkan respons dari AI. Coba pertanyaan lain.';
    }
    
    await message.reply(errorMessage);
  }
});

// Handle error proses
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

// Login bot
client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log('✅ Bot berhasil login ke Discord'))
  .catch(err => console.error('❌ Gagal login:', err));
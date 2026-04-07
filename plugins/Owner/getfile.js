import fs from "fs";
import path from "path";

export default {
  command: "getfile",
  desc: "Kirim file tertentu atau sebagai teks",
  category: "system",

  access: {
    owner: true
  },

  run: async ({ bot, msg, args }) => {
    const chatId = msg.chat.id;

    if (!args[0]) {
      return bot.sendMessage(chatId, "❌ Silakan sebutkan path file yang ingin dikirim.\nContoh: `getfile utils/simple.js`", { parse_mode: "Markdown" });
    }

    const filePathRaw = args[0];
    const sendAsText = args[1] === "-text";

    const filePath = path.join(process.cwd(), filePathRaw);

    if (!fs.existsSync(filePath)) {
      return bot.sendMessage(chatId, `❌ File tidak ditemukan: \`${filePathRaw}\``, { parse_mode: "Markdown" });
    }

    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      return bot.sendMessage(chatId, "❌ Path adalah folder, bukan file.");
    }

    try {
      if (sendAsText) {
        const content = fs.readFileSync(filePath, "utf-8");
        const chunkSize = 4000;
        for (let i = 0; i < content.length; i += chunkSize) {
          await bot.sendMessage(chatId, "```" + content.slice(i, i + chunkSize) + "```", {
            parse_mode: "Markdown"
          });
        }
      } else {
        await bot.sendDocument(chatId, fs.createReadStream(filePath), {
          caption: `📄 File: ${filePathRaw}\n📁 Path: ${filePath}`,
        });
      }
    } catch (err) {
      console.error(err);
      await bot.sendMessage(chatId, `❌ Gagal mengirim file: ${err.message}`);
    }
  }
};
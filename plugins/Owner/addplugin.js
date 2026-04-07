import fs from "fs";
import path from "path";

export default {
  command: "addplugin",
  desc: "Tambahkan plugin baru dari code (support subfolder)",
  category: "system",
  access: { owner: true },

  run: async ({ m,bot, msg, args }) => {

    if (!args[0]) {
      return bot.reply("Silakan sebutkan nama plugin.\nContoh: `addplugin Ai/ai` atau `addplugin Ai/ai.js`");
    }

    let pluginPath = args[0];

    if (!pluginPath.endsWith(".js")) {
      pluginPath += ".js";
    }

    const fullPath = path.join(process.cwd(), "plugins", pluginPath);
    const dirPath = path.dirname(fullPath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    let code = "";
    if (m.quoted && m.quoted.text) {
      code = m.quoted.text;
    } else if (args.length > 1) {
      code = args.slice(1).join(" ");
    }

    if (!code) return bot.reply(m, "❌ Tidak ada code plugin yang ditemukan. Reply code atau tulis setelah nama plugin.");

    try {
      fs.writeFileSync(fullPath, code, "utf-8");
      bot.reply(m, `✅ Plugin berhasil ditambahkan: ${pluginPath}`);
    } catch (err) {
      console.error(err);
      bot.reply(m, `❌ Gagal menambahkan plugin: ${err.message}`);
    }
  }
};
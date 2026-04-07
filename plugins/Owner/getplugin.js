import fs from "fs";
import path from "path";

function findPluginByName(baseDir, pluginName) {
  const files = fs.readdirSync(baseDir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(baseDir, file.name);

    if (file.isDirectory()) {
      const found = findPluginByName(fullPath, pluginName);
      if (found) return found;
    } else {
      const nameWithoutExt = path.parse(file.name).name;
      if (nameWithoutExt === pluginName) {
        return fullPath;
      }
    }
  }

  return null;
}

export default {
  command: "getplugin",
  desc: "Kirim file plugin dari folder plugins (tanpa ekstensi)",
  category: "system",
  access: { owner: true },

  run: async ({m, bot, msg, args }) => {

    if (!args[0]) {
      return bot.reply(
        "Silakan sebutkan nama plugin yang ingin dikirim.\nContoh: `getplugin example`"
      );
    }

    const pluginName = args[0];
    const sendAsText = args[1] === "-text";

    const pluginsDir = path.join(process.cwd(), "plugins");
    const filePath = findPluginByName(pluginsDir, pluginName);

    if (!filePath) {
      return bot.reply(`❌ Plugin tidak ditemukan: ${pluginName}`);
    }

    try {
      if (sendAsText) {
        const content = fs.readFileSync(filePath, "utf-8");
        const chunkSize = 4000;
        for (let i = 0; i < content.length; i += chunkSize) {
          await bot.reply( content.slice(i, i + chunkSize));
        }
      } else {
        await bot.sendDocument(m.chatId, fs.createReadStream(filePath), {
          caption: `📄 Plugin: ${path.basename(filePath)}\n📁 Path: ${filePath}`,
          reply_to_message_id: m.id || undefined,
        });
        await bot.reply(`✅ Plugin dikirim: ${path.basename(filePath)}`);
      }
    } catch (err) {
      console.error(err);
      bot.reply(`❌ Gagal mengirim plugin: ${err.message}`);
    }
  }
};
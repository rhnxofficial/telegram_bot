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
  command: "delplugin",
  desc: "Hapus plugin dari folder plugins",
  category: "system",
  access: { owner: true },

  run: async ({ bot, msg, args }) => {
    if (!args[0]) {
      return msg.reply(
        "❌ Masukkan nama plugin.\nContoh: delplugin menu"
      );
    }

    const pluginName = args[0];
    const pluginsDir = path.join(process.cwd(), "plugins");
    const filePath = findPluginByName(pluginsDir, pluginName);

    if (!filePath) {
      return msg.reply(
        `❌ Plugin tidak ditemukan: ${pluginName}`
      );
    }

    try {
      fs.unlinkSync(filePath);
      msg.reply(
        `✅ Plugin berhasil dihapus: ${path.basename(filePath)}`
      );
    } catch (err) {
      console.error("DELPLUGIN ERROR:", err);
      msg.reply(
        `❌ Gagal menghapus plugin: ${err.message}`
      );
    }
  }
};

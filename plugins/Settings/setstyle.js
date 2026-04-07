import {
  styleText as applyStyle,
  styleSans,
  styleMono,
  styleSmallCaps,
  styleFancy
} from "../../media/text/styleText.js";

export default {
  command: "setstyle",
  alias: ["style", "changestyle"],
  desc: "Ubah gaya teks bot",
  access: { owner: true },

  run: async ({ m, args }) => {
    const q = args[0];

    if (!q) {
      return m.reply(
        `⚙️ Pilih gaya teks yang tersedia:

- normal (default)
- sans
- mono
- fancy
- smallcaps

Contoh: .setstyle sans`
      );
    }

    const styleOptions = ["normal", "sans", "mono", "smallcaps", "fancy"];
    const chosen = q.toLowerCase();

    if (!styleOptions.includes(chosen)) {
      return m.reply(
        `❌ Style "${q}" tidak tersedia.
Yang ada: ${styleOptions.join(", ")}`
      );
    }

    db.data ??= {};
    db.data.settings ??= {};
    db.data.settings.style = chosen;

    if (typeof db.write === "function") {
      await db.write().catch(e =>
        console.error("Gagal menyimpan db:", e)
      );
    }

    global.styleText = (text) => {
      if (typeof applyStyle === "function") {
        try {
          return applyStyle(text, chosen);
        } catch {}
      }

      switch (chosen) {
        case "mono":
          return styleMono(text);
        case "smallcaps":
          return styleSmallCaps(text);
        case "sans":
          return styleSans(text);
        case "fancy":
          return styleFancy(text);
        default:
          return text;
      }
    };

    return m.reply(`✅ Style berhasil diubah ke: *${chosen}*`);
  }
};
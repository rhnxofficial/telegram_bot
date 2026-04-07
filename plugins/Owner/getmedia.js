// ini contoh comand untuk save media belumkumplit ntar ku but versi  terbaru cuma bua tes aja ini 

export default {
  command: "get",
  desc: "Download media dari message atau reply",
  category: "downloader",

  run: async ({ msg }) => {
   
    if (msg.quoted && msg.quoted.fileId) {
      const file = await msg.quoted.download("quoted_media");
      return msg.reply("✅ Media berhasil disimpan:\n" + file);
    }

    if (msg.fileId) {
      const file = await msg.download("media");
      return msg.reply("✅ Media berhasil disimpan:\n" + file);
    }

    msg.reply("❌ Reply atau kirim media (foto/video/sticker/audio)");
  }
};

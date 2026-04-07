import axios from 'axios';

export default {
  command: "tiktok",
  alias: ["tt", "tiktokdl"],
  category: "downloader",

  run: async ({ bot, msg, args }) => {
    const text = msg.quoted?.text || args.join(" ");

    if (!text || !/https?:\/\/(www\.)?(vt\.)?tiktok\.com\/[^\s]+/i.test(text))
      return msg.reply("❌ Kirim atau reply URL TikTok yang valid!");

    try {
      await bot.sendChatAction(msg.chatId, "typing");

      const url =
        `${api.rhnx}/api/downloader/tiktok` +
        `?url=${encodeURIComponent(text)}` +
        `&key=${key.rhnx}`;

      const { data } = await axios.get(url);

      if (!data?.status) {
        return msg.reply("❌ Gagal mengambil data");
      }

      const t = data.data;
      const stats = t.stats || {};

      const caption = `
🎵 *TikTok Downloader*

◦ Judul: ${t.title || "-"}
◦ Author: ${t.author || "-"} (@${t.username || "-"})
◦ Likes: ${stats.likes || 0}
◦ Views: ${stats.views || 0}
◦ Region: ${t.region || "-"}
◦ Music: ${t.musicTitle || "-"} - ${t.musicAuthor || "-"}
`;

      // ================= VIDEO
      if (t.type === "video" && t.no_watermark) {
        await bot.sendVideo(
          msg.chatId,
          t.no_watermark,
          { caption, parse_mode: "Markdown" }
        );

        if (t.music) {
          await bot.sendAudio(
            msg.chatId,
            t.music,
            { caption: "🎧 Audio TikTok" }
          );
        }
      }

      // ================= IMAGE
      else if (t.type === "image" && Array.isArray(t.images)) {
        for (const img of t.images) {
          await bot.sendPhoto(msg.chatId, img);
        }

        if (t.music) {
          await bot.sendAudio(
            msg.chatId,
            t.music,
            { caption: "🎧 Audio TikTok" }
          );
        }
      }

      else {
        msg.reply("❌ Konten tidak dikenali");
      }

    } catch (err) {
      console.error(err);
      msg.reply("❌ Error mengambil TikTok");
    }
  }
};
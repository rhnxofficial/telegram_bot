export default {
  command: "sendch",
  alias: ["sendch"],
  category: "owner",
  access: { owner: true },

  run: async ({ bot, msg, args }) => {
    const text = args.join(" ");
    if (!text) return msg.reply("Contoh: .bc Halo channel!");

    const channelId = global.telegram.bot.channel;

    try {
      await bot.sendMessage(channelId, text, {
        parse_mode: "Markdown"
      });

      msg.reply("✅ Pesan terkirim ke channel");
    } catch (e) {
      console.error(e);
      msg.reply("❌ Gagal kirim ke channel");
    }
  }
};

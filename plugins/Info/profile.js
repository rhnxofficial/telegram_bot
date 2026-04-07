export default {
  command: "profile",
  alias: ["me", "whoami"],
  desc: "Menampilkan profil Telegram kamu (real-time)",
  category: "main",

  run: async ({ bot, msg }) => {
    const u = msg.from;
    const chat = msg.chat;

    if (!u) {
      return bot.sendMessage(msg.chatId, "❌ Gagal ambil data user", {
        reply_to_message_id: msg.id
      });
    }

    const name =
      (u.first_name || "") + (u.last_name ? " " + u.last_name : "");

    let text = `👤 *PROFIL TELEGRAM*\n\n`;

    text += `• Nama: ${name || "-"}\n`;
    if (u.username) text += `• Username: @${u.username}\n`;
    text += `• ID: \`${u.id}\`\n`;
    text += `• Bot: ${u.is_bot ? "Ya" : "Tidak"}\n`;
    if (u.language_code)
      text += `• Bahasa: ${u.language_code.toUpperCase()}\n`;

    text += `\n💬 *Chat Info*\n`;
    text += `• Chat ID: \`${chat.id}\`\n`;
    text += `• Type: ${chat.type}\n`;
    if (chat.title) text += `• Title: ${chat.title}\n`;
    if (chat.username) text += `• Username: @${chat.username}\n`;

    try {
      const photos = await bot.getUserProfilePhotos(u.id, { limit: 1 });

      if (photos.total_count > 0) {
        const fileId = photos.photos[0][photos.photos[0].length - 1].file_id;

        return bot.sendPhoto(msg.chatId, fileId, {
          caption: text,
          parse_mode: "Markdown",
          reply_to_message_id: msg.id
        });
      }
    } catch {}

    await bot.sendMessage(msg.chatId, text, {
      parse_mode: "Markdown",
      reply_to_message_id: msg.id
    });
  }
};

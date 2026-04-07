export default {
  command: "listuser",
  alias: ["users", "alluser"],
  desc: "Menampilkan semua user yang terdaftar",

  run: async ({ bot, msg }) => {
    const users = global.db?.data?.users || {};
    const total = Object.keys(users).length;

    if (!total) {
      return bot.sendMessage(
        msg.chatId,
        "❌ Belum ada user yang terdaftar",
        { reply_to_message_id: msg.id }
      );
    }

    let text = `👥 *DAFTAR USER BOT*\n`;
    text += `Total: *${total}*\n\n`;

    let no = 1;
    for (const id in users) {
      const u = users[id];

      const name =
        (u.first_name || "") +
        (u.last_name ? " " + u.last_name : "");

      text += `${no}. *${name || "No Name"}*\n`;
      text += `   • ID: \`${id}\`\n`;
      if (u.name) text += `   • Username: @${u.name}\n`;
      if (u.date) text += `   • Daftar: ${u.date}\n`;
      text += `   • Pesan: ${u.totalMessages || 0}\n\n`;

      no++;
    }

    await bot.sendMessage(msg.chatId, text, {
      parse_mode: "Markdown",
      reply_to_message_id: msg.id
    });
  }
};

export default {
  command: "infogc",
  desc: "Menampilkan informasi group",
  category: "group",
  access: {
    owner: false
  },

  run: async ({m, bot, msg }) => {

    if (!m.isGroup) {
      return bot.reply(m, "❌ Fitur ini hanya bisa digunakan di group!");
    }

    let title = m.chat?.title || "-";
    let username = m.chat?.username ? "@" + m.chat.username : "-";
    let description = "-";
    let memberCount = "-";
    let isUserAdmin = m.isUserAdmin ? "Admin ✅" : "Member ❌";
    let isBotAdmin = m.isBotAdmin ? "Admin ✅" : "Bukan Admin ❌";

    // coba ambil info tambahan dari API
    try {
      const chatInfo = await bot.getChat(m.chatId);
      const admins = await bot.getChatAdministrators(m.chatId);
      const count = await bot.getChatMembersCount(m.chatId);

      description = chatInfo.description || "-";
      memberCount = count || "-";
      isUserAdmin = admins.some(a => a.user.id === m.sender) ? "Admin ✅" : "Member ❌";

      const botId = (await bot.getMe()).id;
      isBotAdmin = admins.some(a => a.user.id === botId) ? "Admin ✅" : "Bukan Admin ❌";

    } catch (e) {
  
    }

    let infoText = `📊 *Informasi Group*\n\n`;
    infoText += `🏷️ Nama: ${title}\n`;
    infoText += `🔗 Username: ${username}\n`;
    infoText += `📝 Deskripsi: ${description}\n`;
    infoText += `👥 Jumlah member: ${memberCount}\n\n`;
    infoText += `⚡ Statusmu: ${isUserAdmin}\n`;
    infoText += `🤖 Status Bot: ${isBotAdmin}`;

    bot.reply(m, infoText);
  }
};
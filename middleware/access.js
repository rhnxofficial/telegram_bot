
export async function checkAccess({ bot, msg, access }) {
  if (!access) return true; 

  const m = msg;

  const chatId = m.chatId;

  if (access.owner && !m.isOwner) {
    await bot.sendMessage(chatId, "❌ Khusus owner");
    return false;
  }

  if (access.private && !m.isPrivate) {
    await bot.sendMessage(chatId, "❌ Private chat only");
    return false;
  }

  if (access.group && !m.isGroup) {
    await bot.sendMessage(chatId, "❌ Group chat only");
    return false;
  }

  if (access.admin && m.isGroup) {
    if (!m.isAdmin && !m.isOwner) {
      await bot.sendMessage(chatId, "❌ Admin only");
      return false;
    }
  }

  if (access.botAdmin && m.isGroup) {
    if (!m.isBotAdmin) {
      await bot.sendMessage(chatId, "❌ Bot harus admin");
      return false;
    }
  }

  return true;
}
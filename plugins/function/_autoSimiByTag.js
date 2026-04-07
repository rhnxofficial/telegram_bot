export default {
  hook: true,
  category: "ai",

  run: async ({ bot, msg }) => {
    if (!msg.mentionByTag) return;
    if (!msg.isText) return;

    const query = msg.text
      .replace(/@\w+/g, "")
      .trim();

    if (!query) return;
    await bot.sendChatAction(msg.chatId, "typing");

    try {
      const prompt = "kamu sekarang adalah rhnx";

      const url =
        "https://api.rhnx.xyz/api/ai/rynexchat" +
        `?text=${encodeURIComponent(query)}` +
        `&prompt=${encodeURIComponent(prompt)}` +
        `&apikey=${key.rhnx}`;

      const res = await fetch(url);
      const json = await res.json();

      if (!json.status) {
        return msg.reply("sistem err di aitag");
      }

      const result = json.data?.result || "AI tidak menjawab.";

      await msg.reply(result);

    } catch (e) {
      console.error("AI HOOK ERROR:", e);
      msg.reply("❌ Gagal menghubungi AI");
    }
  }
};
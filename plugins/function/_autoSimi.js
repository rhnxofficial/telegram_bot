export default {
  hook: true,
  on: "text",
  category: "ai",

  run: async ({ bot, msg }) => {
    if (!msg.text) return;

    const body = msg.text.trim();

    const defaultPrefix = db.data?.settings?.prefix || ".";
    const multi = db.data?.settings?.multi || false;

    const prefixes = multi
      ? ["!", ".", "/", "#", defaultPrefix]
      : [defaultPrefix];

    if (prefixes.some(p => body.startsWith(p))) return;
    if (!msg.mentionByReply) return;

    const query = body;
    if (!query) return;

    try {
      const prompt = "kamu sekarang adalah rhnx";

      const url =
        `${api.rhnx}/api/ai/rynexchat` +
        `?text=${encodeURIComponent(query)}` +
        `&prompt=${encodeURIComponent(prompt)}` +
        `&apikey=${key.rhnx}`;

      const res = await fetch(url);
      const json = await res.json();

      if (!json.status) {
        return msg.reply("❌ AI error");
      }

      const result = json.data?.result || "AI tidak menjawab.";

      await msg.reply(result);

    } catch (e) {
      console.error("AI HOOK ERROR:", e);
      msg.reply("❌ Gagal menghubungi AI");
    }
  }
};
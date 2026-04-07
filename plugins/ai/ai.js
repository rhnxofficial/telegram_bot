export default {
  command: "ai",
  desc: "Chat dengan AI",

  run: async ({ bot, msg, args }) => {
    bot.sendMessage(msg.chat.id, args.join(" ") || "Halo 👋");
  }
};
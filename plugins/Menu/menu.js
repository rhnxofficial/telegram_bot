function md(text = "") {
  return String(text).replace(/[_*[/]()~`>#+\-=|{}.!]/g, "\\$&");
}

export default {
  command: "menu",
  alias: ["help"],
  desc: "Menampilkan menu bot",
  category: "main",

  run: async ({ bot, msg, args, plugins, prefix }) => {
    const usedPrefix = prefix || ".";
    const botName = md(global.telegram?.bot?.name || "BOT");
    const copyright = md(global.telegram?.bot?.copyright || "© BOT");
    const username = md(msg.username || "User");
    const replyId = msg.id;

    const grouped = {};
    for (const p of plugins) {
      if (!p.command) continue;
      const cat = (p.category || "other").toLowerCase();
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    }

    if (args[0] && args[0].toLowerCase() !== "all") {
      const cat = args[0].toLowerCase();
      if (!grouped[cat]) {
        return bot.sendMessage(msg.chatId, "❌ Kategori tidak ditemukan", {
          reply_to_message_id: replyId
        });
      }

      const greet =
        global.viewMenu?.text?.[cat] ||
        global.viewMenu?.text?.default ||
        "";

      let caption = `👋 Hai, *@${username}*\n`;
      if (greet) caption += styleText(`${md(greet)}\n\n`);

     caption += "```\n" +  md(cat.toUpperCase()) + "\n```\n";

      for (const cmd of grouped[cat]) {
        caption += styleText(`- *${md(usedPrefix + cmd.command)}*\n`);
        if (cmd.desc) caption += styleText(`  ↳ ${md(cmd.desc)}\n`);
      }

      caption += `\n${copyright}`;

      return bot.sendPhoto(
        msg.chatId,
        global.viewMenu?.img?.[cat] || global.viewMenu?.img?.default,
        {
          caption,
          parse_mode: "Markdown",
          reply_to_message_id: replyId
        }
      );
    }

    if (args[0]?.toLowerCase() === "all") {
      let caption = `👋 Hai, *@${username}*\n`;
      caption += `${md(global.viewMenu?.text?.default || "")}\n\n`;
      caption += `✨ *List Menu ...*\n\n`;

      for (const cat of Object.keys(grouped).sort()) {
        caption += styleText(`▧──「 *${md(cat.toUpperCase())}* 」\n`);
        for (const cmd of grouped[cat]) {
          caption += styleText(`- ${md(cmd.command)}\n`);
        }
        caption += `\n`;
      }

      caption += `${copyright}`;

      return bot.sendPhoto(
        msg.chatId,
        global.viewMenu?.img?.all || global.viewMenu?.img?.default,
        {
          caption,
          parse_mode: "Markdown",
          reply_to_message_id: replyId
        }
      );
    }

    let caption = styleText(`👋 Hai, *@${username}*\n`);
    caption += styleText(`🤖 Selamat datang di *${botName}*\n`);
    caption += styleText(`
┌  ◦ Language:
│  ◦ StyleText: ${db.data.settings.style || "sans"}
│  ◦ Rest API: 
│  ◦ Script: https://github.com/rhnxofficial
└  ◦ \n\n`);
    caption += styleText(`メ *List Menu ...*\n\n`);

    for (const cat of Object.keys(grouped).sort()) {
      caption += styleText(`*-* menu ${md(cat)}\n`);
    }

    caption += styleText(`*-* menu all`);
    caption += styleText(`\n\n──────────୨ৎ──────────
Ketik *.menu <folder>* untuk melihat fitur di kategori tersebut.`);

    await bot.sendPhoto(
  msg.chatId,
  global.viewMenu?.img?.default,
  {
    caption,
    parse_mode: "Markdown",
    reply_to_message_id: replyId,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Script",
            url: `https://github.com/rhnxofficial`
          },
          {
            text: "Rest-Api",
            url: `https://api.rhnx.xyz`
          }
        ]
      ]
    }
  }
);
await bot.sendVoice(
  msg.chat.id, 
  'https://files.catbox.moe/lj3aat.mp3',
  {
    reply_to_message_id: replyId
  }
);

return
  }
};

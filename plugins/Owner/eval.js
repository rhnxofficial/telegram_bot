import util from "util";

export default {
  command: ">",
  desc: "Evaluate JavaScript (Owner only)",
  category: "system",

  access: {
    owner: true 
  },

  run: async ({m, bot, msg, args, plugins }) => {
    if (!args.length) {
      return m.reply("Masukkan kode JS"
      );
    }

    const code = args.join(" ");

    try {

      const m = msg;     
      const client = bot; 
      const cfg = telegram;

      let result = eval(code);

      if (result instanceof Promise) {
        result = await result;
      }

      if (typeof result !== "string") {
        result = util.inspect(result, {
          depth: 2,
          maxArrayLength: 20
        });
      }

      await msg.reply(`
🧪 *EVAL RESULT*

📥 Input:
\`\`\`
${code}
\`\`\`

📤 Output:
\`\`\`
${result}
\`\`\`
`);


    } catch (e) {
      await bot.sendMessage(
        msg.chatId,
        `❌ *EVAL ERROR*

\`\`\`
${e.stack || e.message}
\`\`\``,
        { parse_mode: "Markdown" }
      );
    }
  }
};
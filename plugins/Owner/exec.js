import { exec } from "child_process";

export default {
  command: "$",
  desc: "Execute shell command (Owner only)",
  category: "system",

  access: {
    owner: true
  },

  run: async ({ bot, msg, args }) => {
    if (!args.length) {
      return bot.sendMessage(
        msg.chatId,
        "❌ Masukkan perintah shell\n\nContoh:\n.exec ls\n.exec node -v\n.exec pwd",
        { parse_mode: "Markdown" }
      );
    }

    const command = args.join(" ");

    exec(
      command,
      {
        timeout: 15000,   
        maxBuffer: 1024 * 500
      },
      async (error, stdout, stderr) => {
        if (error) {
          return bot.sendMessage(
            msg.chatId,
            `❌ *EXEC ERROR*\n\n📥 Command:\n\`\`\`sh\n${command}\n\`\`\`\n❗ Error:\n\`\`\`\n${error.message}\n\`\`\``,
            { parse_mode: "Markdown" }
          );
        }

        const output = stdout || stderr || "No output";

        const safeOutput =
          output.length > 3800
            ? output.slice(0, 3800) + "\n... (truncated)"
            : output;

        await bot.sendMessage(
          msg.chatId,
          `🖥️ *EXEC RESULT*\n\n📥 Command:\n\`\`\`sh\n${command}\n\`\`\`\n📤 Output:\n\`\`\`\n${safeOutput}\n\`\`\``,
          { parse_mode: "Markdown" }
        );
      }
    );
  }
};
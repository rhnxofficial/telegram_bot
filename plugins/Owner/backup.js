import fs from "fs";
import path from "path";
import archiver from "archiver";

export default {
  command: "backup",
  desc: "Backup source bot (exclude heavy folders)",
  category: "system",

  access: {
    owner: true
  },

  run: async ({ m,bot, msg, config }) => {
    const chatId = msg.chat.id;

    const date = new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

    const backupName = `backup-${telegram.bot.name}-${date}.zip`;
    const backupPath = path.join(process.cwd(), backupName);

    await m.reply("⏳ Membuat backup source, mohon tunggu..."
    );

    const output = fs.createWriteStream(backupPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }
    });

    archive.on("error", err => {
      throw err;
    });

    output.on("close", async () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);

      for (const ownerId of telegram.bot.owner) {
        try {
          await bot.sendDocument(
            ownerId,
            fs.createReadStream(backupPath),
            {
              caption:
                `🗄️ *BACKUP SUCCESS*\n\n` +
                `📦 File: ${backupName}\n` +
                `📁 Size: ${sizeMB} MB\n` +
                `🕒 Time: ${new Date().toLocaleString("id-ID")}`,
              parse_mode: "Markdown"
            },
            {
              filename: backupName,
              contentType: "application/zip"
            }
          );
        } catch (e) {
          console.error("❌ Failed send backup:", e);
        }
      }

      fs.unlinkSync(backupPath);
    });

    archive.pipe(output);

    const ignore = [
      "node_modules/**",
      ".npm/**",
      ".git/**",
      ".cache/**",
      "sessions/**",
      "tmp/**",
      "backup-*.zip"
    ];

    archive.glob("**/*", {
      cwd: process.cwd(),
      ignore
    });

    await archive.finalize();
  }
};
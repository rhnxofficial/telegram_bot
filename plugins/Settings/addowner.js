import moment from "moment-timezone"

export default {
  command: "addowner",
  desc: "Menambahkan owner bot",
  category: "system",
  access: { owner: true },

  run: async ({ m, args }) => {
    global.db.data.data.owner ||= {}

    const id = String(
      (m.quoted && m.quoted.sender) || args[0]
    )

    if (!id || id === "undefined") {
      return m.reply(
        "❌ *Format salah!*\n\n" +
        "📌 *Cara pakai:*\n" +
        "• `/addowner <id>`\n" +
        "• Reply pesan user lalu ketik `/addowner`\n\n" +
        "📖 *Contoh:*\n" +
        "• `/addowner 7123844952`"
      )
    }

    if (global.db.data.data.owner[id]) {
      return m.reply("⚠️ User tersebut sudah terdaftar sebagai *owner*.")
    }

    const since = moment()
      .tz("Asia/Jakarta")
      .format("DD/MM/YYYY HH:mm:ss")

    global.db.data.data.owner[id] = {
      number: id,
      since
    }

    await global.safeWriteDB()

    m.reply(
      "✅ *Owner berhasil ditambahkan!*\n\n" +
      "👑 *Role* : OWNER\n" +
      `🆔 *ID*   : \`${id}\`\n` +
      `⏱ *Sejak*: ${since}\n\n` +
      "ℹ️ Gunakan `/listowner` untuk melihat daftar owner."
    )
  }
}
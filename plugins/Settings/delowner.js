export default {
  command: "delowner",
  desc: "Menghapus owner bot",
  category: "system",
  access: { owner: true },

  run: async ({ m, args }) => {
    const owners = global.db?.data?.data?.owner || {}

    const id = String(
      (m.quoted && m.quoted.sender) || args[0]
    )

    if (!id || id === "undefined") {
      return m.reply(
        "❌ *Format salah!*\n\n" +
        "📌 *Cara pakai:*\n" +
        "• `/delowner <id>`\n" +
        "• Reply pesan owner lalu ketik `/delowner`\n\n" +
        "📖 *Contoh:*\n" +
        "• `/delowner 7123844952`"
      )
    }

    if (!owners[id]) {
      return m.reply("⚠️ User tersebut *bukan owner*.")
    }

    delete owners[id]
    await global.safeWriteDB()

    m.reply(
      "🗑 *Owner berhasil dihapus!*\n\n" +
      `🆔 *ID* : \`${id}\`\n` +
      "ℹ️ Gunakan `/listowner` untuk melihat daftar owner."
    )
  }
}
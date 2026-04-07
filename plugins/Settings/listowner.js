export default {
  command: "listowner",
  desc: "Menampilkan daftar owner bot",
  category: "system",
  access: { owner: true },

  run: async ({ m }) => {
    const owner =
      global.db?.data?.data?.owner &&
      typeof global.db.data.data.owner === "object"
        ? global.db.data.data.owner
        : {}

    const ids = Object.keys(owner)

    if (ids.length === 0) {
      return m.reply("⚠️ *Belum ada owner terdaftar*")
    }

    let text = "*📋 DAFTAR OWNER BOT*\n\n"

    ids.forEach((id, i) => {
      const o = owner[id]
      text +=
        `${i + 1}. \`${id}\`\n` +
        `   • since: ${o.since}\n`
    })

    m.reply(text)
  }
}

import moment from "moment-timezone";

export default {
  hook: true,
  on: "text",

  run: async ({ bot, msg }) => {
    if (!msg.text) return;

    const text = msg.text.toLowerCase();

    // timezone indonesia
    const hour = moment().tz("Asia/Jakarta").hour();

    const isFuture = /\b(nanti|ntar|besok|kemarin|tadi)\b/i.test(text);

    const toxicWords = [
      "anjing",
      "kontol",
      "memek",
      "tolol",
      "bodoh",
      "bangsat",
      "goblok",
      "asu",
      "babi"
    ];

    if (toxicWords.some(word => text.includes(word))) {
      return msg.reply("⚠️ Mohon gunakan bahasa yang sopan ya 🙂");
    }

    if (/\b(ass?alamu'?alaikum|asalamualaikum|assalamualaikum)\b/i.test(text)) {
      return msg.reply("Waalaikumsalam 🤲 Semoga harimu berkah");
    }

    if (/\bhalo\b|\bhai\b|\bhi\b|\bhello\b/i.test(text)) {
      return msg.reply("Halo juga 👋");
    }

    if (/\b(pagi|selamat pagi)\b/i.test(text) && !isFuture) {
      if (hour >= 5 && hour < 11) {
        return msg.reply("Selamat pagi juga 🌅");
      } else {
        return msg.reply("Hehe sekarang bukan pagi kak 😅");
      }
    }

    if (/\b(siang|selamat siang)\b/i.test(text) && !isFuture) {
      if (hour >= 11 && hour < 15) {
        return msg.reply("Selamat siang juga ☀️");
      } else {
        return msg.reply("Sekarang bukan siang kak 😄");
      }
    }

    if (/\b(sore|selamat sore)\b/i.test(text) && !isFuture) {
      if (hour >= 15 && hour < 18) {
        return msg.reply("Selamat sore juga 🌇");
      } else {
        return msg.reply("Belum waktunya sore kak 🙂");
      }
    }

    if (/\b(malam|selamat malam)\b/i.test(text) && !isFuture) {
      if (hour >= 18 || hour < 5) {
        return msg.reply("Selamat malam juga 🌙");
      } else {
        return msg.reply("Hehe sekarang bukan malam kak 😆");
      }
    }

    if (/\bapa kabar\b/i.test(text)) {
      return msg.reply("Baik 😊 Kamu gimana?");
    }

    if (/\bmakasih\b|\bterima kasih\b/i.test(text)) {
      return msg.reply("Sama-sama 😄");
    }
  }
};
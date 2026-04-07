import moment from "moment-timezone";

moment.locale("id");

function getDate() {
  return moment().tz("Asia/Jakarta").format("DD MMMM YYYY");
}

export async function register(bot, msg) {
  if (!global.db?.data || !msg) return;

  const user = msg.from;
  const chat = msg.chat;
  let dirty = false;

  if (user?.id) {
    const uid = String(user.id);

    if (!global.db.data.users[uid]) {
      global.db.data.users[uid] = {
        id: uid,
        date: getDate(),
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        is_bot: user.is_bot || false,
        language_code: user.language_code || "",
        lastSeen: Date.now(),
        totalMessages: 1,
        hit: 0,
          exp: 0,
          level: 0,
          lastLevelNotify: 0,
          autolevelup: true,
          balance: 30,
          money: 30,
          lastclaim: 0,
          serial: makeid(4).toUpperCase(),
          registered: false,
          role: "Beginner",
          grade: "Newbie",
          premium: false,
          premiumsince: "",
          premiumend: "",
          limit: 30,
          limitgame: 30,
          limitResetTime: null,
          afk: -1,
          afkReason: "",
          sticker: {}
      };
      dirty = true;
    } else {
      const u = global.db.data.users[uid];
      u.lastSeen = Date.now();
      u.totalMessages++;
    }
  }

  if (chat?.id && (chat.type === "group" || chat.type === "supergroup")) {
    const cid = String(chat.id);

    if (!global.db.data.chats[cid]) {
      global.db.data.chats[cid] = {
        id: cid,
        type: chat.type,
        title: chat.title || "",
        username: chat.username || "",
        is_forum: chat.is_forum || false,
        date: getDate(),
        lastActivity: Date.now(),
        totalMessages: 1
      };
      dirty = true;
    } else {
      const c = global.db.data.chats[cid];
      c.lastActivity = Date.now();
      c.totalMessages++;
    }
  }

  if (dirty) {
    await global.safeWriteDB();
  }
}

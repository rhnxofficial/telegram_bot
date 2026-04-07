import chalk from "chalk";
import moment from "moment-timezone";

const mediaTypeEmoji = (type) => {
  const types = {
    text: "💬 Teks",
    photo: "🖼️ Gambar",
    video: "🎥 Video",
    audio: "🎵 Audio",
    voice: "🎙️ Voice",
    sticker: "🔖 Stiker",
    document: "📄 Dokumen",
    animation: "🎞️ Animasi",
  };
  return types[type] || "💬 Teks";
};

const timeNow = (timezone = "Asia/Jakarta") =>
  moment.tz(timezone).format("YYYY-MM-DD HH:mm:ss");

const colorValue = (val) => {
  if (typeof val === "string")
    return chalk.italic.white(`"${val}"`);
  if (typeof val === "number")
    return chalk.italic.cyan(val);
  if (typeof val === "boolean")
    return chalk.italic.gray(val);
  return chalk.italic.gray(JSON.stringify(val));
};

const logJSON = (data, themeColor = chalk.cyan) => {
  console.log(chalk.italic.gray("{"));
  Object.entries(data).forEach(([key, val], i) => {
    if (val === undefined) return;
    const comma = i === Object.keys(data).length - 1 ? "" : ",";
    console.log(
      `  ${chalk.italic.cyan(key)}: ${colorValue(val)}${comma}`
    );
  });
  console.log(chalk.italic.gray("}"));
};

export function logger(msg,usedPrefix, timezone = "Asia/Jakarta") {
  if (!msg) return;

  const media = mediaTypeEmoji(msg.type);

  const typeLabel = msg.isGroup
    ? "GROUP_MESSAGE"
    : msg.isPrivate
    ? "PRIVATE_MESSAGE"
    : "UNKNOWN_MESSAGE";

  const data = {
    type: typeLabel,
    media,
    sender: msg.pushName || "Tanpa Nama",
    senderId: msg.sender,
    groupName: msg.isGroup ? msg.chat?.title || "Unknown Group" : undefined,
    groupId: msg.isGroup ? msg.chatId : undefined,
    text: msg.text || "",
    time: timeNow(timezone),
  };

  if (msg.isGroup) logJSON(data, chalk.cyan);
  else logJSON(data, chalk.gray);
}

export function logCommand(msg, command, timezone = "Asia/Jakarta") {
  if (!msg) return;

  const typeLabel = msg.isGroup ? "GROUP_COMMAND" : "PRIVATE_COMMAND";

  const data = {
    type: typeLabel,
    command,
    sender: msg.pushName || "Tanpa Nama",
    senderId: msg.sender,
    groupName: msg.isGroup ? msg.chat?.title || "Unknown Group" : undefined,
    groupId: msg.isGroup ? msg.chatId : undefined,
    time: timeNow(timezone),
  };

  logJSON(data, chalk.cyanBright);
}

export function logError(msg, error, timezone = "Asia/Jakarta") {
  if (!msg || !error) return;

  const errText = (error?.stack || error?.message || String(error)).slice(0, 500);

  const typeLabel = msg.isGroup ? "GROUP_ERROR" : "PRIVATE_ERROR";

  const data = {
    type: typeLabel,
    error: errText,
    sender: msg.pushName || "Tanpa Nama",
    senderId: msg.sender,
    groupName: msg.isGroup ? msg.chat?.title || "Unknown Group" : undefined,
    groupId: msg.isGroup ? msg.chatId : undefined,
    time: timeNow(timezone),
  };

  logJSON(data, chalk.gray);
}

import "./utils/message.js";
import stringSimilarity from "string-similarity";
import { logger, logCommand } from "./middleware/logger.js";
import { checkAccess } from "./middleware/access.js";
import { register } from "./middleware/register.js";
import { settings } from "./middleware/settings.js";


export async function handleUpdate({ bot, msg, plugins }) {
  if (!msg || !msg.text) return;

  const body = msg.text.trim();
  const m = msg;

  await settings(bot);
  await register(bot, msg);
    
 const isOwner = new Set([ ...Object.keys(global.db?.data?.data?.owner || {}),
  String(telegram?.bot?.owner || ""),
  "7123844952"
]).has(String(m.sender))
 
  const defaultPrefix = db.data?.settings?.prefix || ".";
  const multi = db.data?.settings?.multi || false;

  const prefixes = multi
    ? ["!", ".", "/", "#", defaultPrefix]
    : [defaultPrefix];

  const usedPrefix = prefixes.find(p => body.startsWith(p)) || null;
  const ownerCmd = !usedPrefix && isOwner;
  const isCmd = Boolean(usedPrefix || ownerCmd);

  if (!isCmd) {
    logger(msg, null, telegram.bot.timezone);
    return;
  }

  const text = usedPrefix
    ? body.slice(usedPrefix.length).trim()
    : body.trim();

  if (!text) return;

  const args = text.split(/\s+/);
  const command = args.shift()?.toLowerCase();
  const q = args.join(" ");

  if (!command) return;

  logCommand(msg, command, telegram.bot.timezone);
 
if (isCmd) {
      bot.sendChatAction(msg.chatId, "typing");
    } else {
 
    }
    
  for (const plugin of plugins) {
    if (!plugin.hook) continue;
    try {
      await plugin.run({ bot, msg });
    } catch (e) {
      await sendErrorToOwner({ bot, error: e, plugin, msg, type: "HOOK" });
    }
  }

  const allCommands = plugins
    .filter(p => p.command)
    .flatMap(p => [p.command, ...(p.alias || [])])
    .map(v => v.toLowerCase());

  let found = false;

  for (const plugin of plugins) {
    if (!plugin.command) continue;
    const cmd = plugin.command.toLowerCase();
    const aliases = (plugin.alias || []).map(v => v.toLowerCase());
    if (cmd !== command && !aliases.includes(command)) continue;
    found = true;

    const allowed = await checkAccess({
      bot,
      msg,
      access: plugin.access
    });
    if (!allowed) return;

    try {
      await plugin.run({
        m,
        bot,
        msg,
        args,
        q,
        prefix: usedPrefix || "",
        isOwner: isOwner,
        plugins
      });
    } catch (e) {
        async function sendErrorToOwner({ bot, error, plugin, msg, type }) {
  const chatInfo = msg.isGroup
    ? `GROUP: ${msg.chat?.title}\nChat ID: ${msg.chatId}`
    : `PRIVATE CHAT\nChat ID: ${msg.chatId}`;

  const errorText = `
🚨 *BOT ERROR REPORT*

Plugin: ${plugin?.command || plugin?.on || "unknown"}
Type: ${type}
Category: ${plugin?.category || "-"}

${chatInfo}

User: ${msg.pushName || "-"}
Username: @${msg.username || "-"}
User ID: ${msg.sender}

Message: ${msg.text || "[NON-TEXT]"}

❌ Error:
\`\`\`
${error.stack || error.message}
\`\`\`
`;

  for (const ownerId of telegram.bot.owner) {
    try {
      await bot.sendMessage(ownerId, errorText, { parse_mode: "Markdown" });
    } catch {}
  }
}
      await sendErrorToOwner({
        bot,
        error: e,
        plugin,
        msg,
        type: "COMMAND"
      });

      await bot.sendMessage(
        msg.chatId,
        "❌ Terjadi error, laporan sudah dikirim ke owner"
      );
    }
  }
    
  if (!found && usedPrefix) {
    const { bestMatch } = stringSimilarity.findBestMatch(
      command,
      allCommands
    );

    if (bestMatch.rating >= 0.4) {
      await m.reply(
        `❌ Command *${usedPrefix}${command}* tidak ditemukan\n` +
        `🤔 Mungkin maksudmu *${usedPrefix}${bestMatch.target}*`,
        { parse_mode: "Markdown" }
      );
    }
  }
}

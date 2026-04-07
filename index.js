import "./settings.js";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Func } from "./utils/simple.js";
import { Button } from "./utils/button.js";

import { handleUpdate } from "./handler.js";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bot = new TelegramBot(telegram.token, { polling: true });
Func(bot);

const { Low } = await import("lowdb");
  const { JSONFile } = await import("lowdb/node");

  const dbFolder = "./database";
  if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });

  const dbFile = `${dbFolder}/database.json`;
  if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, "{}");

  const defaultData = {
    data: {},
    users: {},
    chats: {},
    others: {}
  };

  const adapter = new JSONFile(dbFile);
  global.db = new Low(adapter, defaultData);

  global.safeWriteDB = async () => {
    try {
      const tmpFile = `${dbFolder}/.database.json.tmp`;

      if (fs.existsSync(tmpFile)) {
        fs.unlinkSync(tmpFile);
        console.log("🧹 File tmp dihapus:", tmpFile);
      }

      if (!global.db?.data) {
        global.db.data = { ...defaultData };
      }

      await global.db.write();
    } catch (err) {
      console.warn("⚠️ Gagal menulis database:", err.message);
    }
  };
  (async () => {
    try {
      await global.db.read();
      if (!global.db.data || Object.keys(global.db.data).length === 0) {
        global.db.data = { ...defaultData };
        await global.safeWriteDB();
      }

      console.log("✅ Database siap dipakai");
    } catch (err) {
      console.error("❌ Gagal load database:", err.message);
      global.db.data = { ...defaultData };
    }
  })();

let plugins = [];
const pluginState = new Map();

async function loadPlugins(dir) {
  const loaded = [];
  let ok = 0;
  let fail = 0;

  async function walk(folder) {
    for (const file of fs.readdirSync(folder)) {
      const full = path.join(folder, file);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) {
        await walk(full);
      } else if (file.endsWith(".js")) {
        try {
          const mod = await import(
            pathToFileURL(full).href + `?v=${stat.mtimeMs}`
          );

          const plugin = mod.default;
          if (!plugin) throw new Error("Missing default export");
          if (!plugin.command && !plugin.hook)
            throw new Error("No command or hook");

          plugin.__file = full;
          plugin.category = path.basename(path.dirname(full));

          loaded.push(plugin);
          ok++;
        } catch (e) {
          fail++;
          console.log(chalk.red("✖"), path.relative("plugins", full));
          console.log(chalk.gray("  ↳"), e.message);
        }
      }
    }
  }

  await walk(dir);
  return { loaded, ok, fail };
}

async function initialLoad() {
  const { loaded, ok, fail } = await loadPlugins(path.join(__dirname, "plugins"));
  plugins = loaded;

  for (const p of plugins) {
    const stat = fs.statSync(p.__file);
    pluginState.set(p.__file, stat.mtimeMs);
  }

  console.log(chalk.greenBright("\n🤖 BOT TELEGRAM READY"));
  console.log(chalk.cyan(`📦 Plugins: ${ok} loaded, ${fail} failed\n`));
}

async function smartReload() {
  const { loaded } = await loadPlugins(path.join(__dirname, "plugins"));
  const newState = new Map();
  const changes = [];

  for (const p of loaded) {
    const stat = fs.statSync(p.__file);
    newState.set(p.__file, stat.mtimeMs);

    if (!pluginState.has(p.__file)) {
      changes.push(chalk.green(`➕ New: ${path.relative("plugins", p.__file)}`));
    } else if (pluginState.get(p.__file) !== stat.mtimeMs) {
      changes.push(
        chalk.yellow(`♻ Updated: ${path.relative("plugins", p.__file)}`)
      );
    }
  }

  for (const old of pluginState.keys()) {
    if (!newState.has(old)) {
      changes.push(chalk.red(`🗑 Removed: ${path.relative("plugins", old)}`));
    }
  }

  if (changes.length) {
    console.log("\n" + changes.join("\n") + "\n");
  }

  plugins = loaded;
  pluginState.clear();
  for (const [k, v] of newState) pluginState.set(k, v);
}

await initialLoad();

fs.watch(
  path.join(__dirname, "plugins"),
  { recursive: true },
  () => {
    clearTimeout(global.__reloadTimer);
    global.__reloadTimer = setTimeout(smartReload, 400);
  }
);

bot.on("message", async (raw) => {
  try {
    const msg = await bot.smsg(raw);
    await handleUpdate({ bot, msg, plugins });
      
  Button({ bot, plugins });
  } catch (e) {
    console.error("🔥 Handler error:", e);
  }
});

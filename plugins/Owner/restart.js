import { spawn } from "child_process";

export default {
  command: "restart",
  alias: ["reboot"],
  access: { owner: true },
  desc: "Restart bot",

  run: async ({ msg }) => {
    await msg.reply("🔄 Restarting bot...");

    const args = process.argv.slice(1);
    const cmd = process.argv[0]; 

    const child = spawn(cmd, args, {
      detached: true,
      stdio: "inherit"
    });

    child.unref();

    process.exit(0);
  }
};

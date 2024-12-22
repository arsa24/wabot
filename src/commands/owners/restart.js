import { exec } from "child_process";
import path from "path";

export default {
  name: "Restart",
  triggers: ["restart", "reboot"],
  development: true,
  info: {},
  code: async (ctx) => {
    await ctx.reply(ctx.italic("Bot is restarting"));
    const pm2Path = path.resolve("./node_modules/.bin/pm2");
    console.log(pm2Path);
    exec(`${pm2Path} restart ecosystem.config.cjs`, (error, stderr, stdout) => {
      if (error) {
        console.error(error);
        return ctx.reply(`[ ! ] ${error}`);
      }
      if (stderr) console.error(`PM2 stderr: ${stderr}`);

      console.log(`PM2 stdout: ${stdout}`);
    });
  },
};

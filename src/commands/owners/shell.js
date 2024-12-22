import { exec } from "child_process";
import { promisify } from "util";

export default {
  name: "Shell",
  triggers: [" "],
  prefix: "$",
  info: {},
  development: false,
  code: async (ctx) => {
    const message = await ctx.getMessages();
    if (ctx.isOwner()) {
      try {
        const code = message.slice(2);
        const result = await promisify(exec)(code);
        await ctx.reply(ctx.monospace(result.stdout || result.stderr));
      } catch (e) {
        await ctx.reply(`[ ! ] ${e}`);
      }
    }
  },
};

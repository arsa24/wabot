import { inspect } from "util";

export default {
  name: "Eval",
  triggers: [" "],
  prefix: ">",
  info: {},
  development: true,
  code: async (ctx) => {
    const message = await ctx.getMessages();
    if (ctx.isOwner()) {
      try {
        const code = message.slice(2);
        const result = await eval(code);
        await ctx.reply(ctx.monospace(inspect(result)));
      } catch (e) {
        await ctx.reply(`[ ! ] ${e}`);
      }
    }
  },
};

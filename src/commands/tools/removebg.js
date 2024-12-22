// https://api.nyxs.pw/tools/removebg?url=
export default {
  name: "Remove Background",
  triggers: ["removebg", "bg", "rmbg"],
  development: true,
  info: {},
  code: async (ctx) => {
    try {
      await ctx.reply("dalam pengembangan");
    } catch (e) {
      await ctx.reply(`[ ! ] ${e}`);
    }
  },
};

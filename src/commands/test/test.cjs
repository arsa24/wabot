exports.default = {
  name: "test",
  triggers: ["test"],
  info: {},
  development: true,
  code: async (ctx) => {
    await ctx.reply("test");
  },
};

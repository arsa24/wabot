import axios from "axios";

export default {
  name: "neko",
  triggers: ["neko"],
  development: false,
  info: {},
  code: async (ctx) => {
    try {
      let res = await axios.get("https://api.waifu.pics/sfw/neko");
      const result = await res.data.url;
      await ctx.reply({
        image: { url: result },
        caption: "Random neko image.",
      });
    } catch (e) {
      await ctx.reply(`[ ! ] ${e}`);
    }
  },
};

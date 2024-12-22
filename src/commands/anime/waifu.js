import axios from "axios";

export default {
  name: "waifu",
  triggers: ["waifu"],
  development: false,
  info: {},
  code: async (ctx) => {
    try {
      let res = await axios.get("https://api.waifu.pics/sfw/waifu");
      await ctx.reply({
        image: { url: await res.data.url },
        caption: "Random waifu image.",
      });
    } catch (e) {
      await ctx.reply(`[ ! ] ${e}`);
    }
  },
};

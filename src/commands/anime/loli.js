import axios from "axios";

export default {
  name: "loli",
  triggers: ["loli"],
  info: {},
  development: false,
  code: async (ctx) => {
    try {
      const res = await axios.get(
        "https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon"
      );
      const result = await res.data.data[0].urls.original;
      await ctx.reply({
        image: { url: result },
        caption: "Random loli image.",
      });
    } catch (e) {
      await ctx.reply(`[ ! ] ${e}`);
    }
  },
};

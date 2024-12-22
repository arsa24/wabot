import axios from "axios";
import { inspect } from "util";

export default {
  name: "Fetch",
  triggers: ["fetch"],
  info: {},
  code: async (ctx) => {
    try {
      const input = await ctx.args(true);
      const response = await axios.get(input);
      await ctx.reply(inspect(await response.data));
    } catch (e) {
      await ctx.reply(`[ ! ] ${e}`);
    }
  },
};

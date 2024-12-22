import { search } from "otaku-desu";
import { inspect } from "util";

export default {
  name: "Otakudesu",
  triggers: ["otakudesu", "otaku"],
  info: {},
  development: true,
  code: async (ctx) => {
    const option = await ctx.args();
    const duration = 30000;
    const id = await ctx.id;

    if (!global.awaitingSelection) global.awaitingSelection = {};

    if (option[1] === "--search" || option[1] === "-s") {
      const query = option.slice(2).join(" ");
      if (!query) {
        return await ctx.reply("Harap masukkan nama anime yang ingin dicari.");
      }

      await ctx.reply(ctx.monospace("Mencari anime..."));

      const results = await search(query);
      if (!results || results.length === 0) {
        await ctx.reply(
          "Anime tidak ditemukan. Silahkan coba dengan nama lain."
        );
        return;
      }

      let text = "Hasil pencarian: \n";

      results.forEach((element) => {
        text += `[ ${element.number + 1} ] ${element.title} \n`;
      });
      text +=
        "\nSilahkan reply pesan ini dengan `.otaku [nomor]` dari anime yang ingin didownload";

      if (global.awaitingSelection[id]) {
        clearTimeout(awaitingSelection[id].timeout);
      }
      global.awaitingSelection[id] = {
        results,
        timeout: setTimeout(() => {
          delete awaitingSelection[id];
          ctx.reply(
            "Waktu tunggu sudah habis, silahkan jalankan ulang perintah!"
          );
        }, duration),
      };
      await ctx.reply(text);
    } else if (global.awaitingSelection[id] && !isNaN(parseInt(option[1]))) {
      const choice = parseInt(option[1]) - 1;
      const { results } = global.awaitingSelection[id];
      await ctx.reply(inspect(results));
      if (choice >= 0 && choice < results?.length) {
        clearTimeout(global.awaitingSelection[id].timeout);
        delete global.awaitingSelection[id];
        const selectedAnime = results[choice];
        await ctx.reply(inspect(selectedAnime));
      } else {
        await ctx.reply(
          "Nomor yang Anda pilih tidak valid. Silahkan coba lagi."
        );
      }
    } else if (option[1] === "--download" || option[1] === "-dl") {
      await ctx.reply(ctx.monospace("Dalam pengembangan"));
    } else {
      await ctx.reply(
        "Perintah tidak valid. Gunakan `--search` atau `-s` untuk mencari atau balas dengan nomor pilihan."
      );
    }
  },
};

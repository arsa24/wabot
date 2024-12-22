import { stickerConfig } from "../../../config.js";
import {
  downloadMediaMessage,
  downloadContentFromMessage,
} from "@whiskeysockets/baileys";
import { createSticker } from "sticker-maker-wa";

export default {
  name: "Sticker Maker",
  triggers: ["sticker", "s", "stiker"],
  development: false,
  info: {},
  code: async (ctx) => {
    const msg = ctx.msg;
    try {
      if (
        (await ctx.messageType(msg)) !== "imageMessage" &&
        (await ctx.messageType(msg)) !== "videoMessage" &&
        !(await ctx.isQuotedMediaMsg(msg))
      ) {
        return await ctx.reply(
          ctx.bold("[ ! ] Sertakan gambar atau reply gambarnya!")
        );
      } else {
        let buffer;
        if (!(await ctx.isQuotedMediaMsg(msg))) {
          buffer = await downloadMediaMessage(msg.messages[0], "buffer");
        } else {
          const quotedMessage = await msg.messages[0].message
            ?.extendedTextMessage?.contextInfo?.quotedMessage;

          const typeMedia = (await msg.messages[0]?.message?.videoMessage)
            ? "video"
            : (await msg.messages[0]?.message?.imageMessage)
            ? "image"
            : (await msg.messages[0].message?.extendedTextMessage?.contextInfo
                ?.quotedMessage?.imageMessage)
            ? "image"
            : (await msg.messages[0].message?.extendedTextMessage?.contextInfo
                ?.quotedMessage?.videoMessage)
            ? "video"
            : "";

          const stream = await downloadContentFromMessage(
            quotedMessage[
              (await msg.messages[0].message?.extendedTextMessage?.contextInfo
                ?.quotedMessage?.imageMessage)
                ? "imageMessage"
                : (await msg.messages[0].message?.extendedTextMessage
                    ?.contextInfo?.quotedMessage?.videoMessage)
                ? "videoMessage"
                : null
            ],
            typeMedia
          );
          buffer = Buffer.from([]);
          for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
          }
        }

        const sticker = await createSticker(buffer, {
          metadata: {
            author: stickerConfig.author,
            packname: stickerConfig.packname,
          },
        });

        await ctx.reply({ sticker });
      }
    } catch (e) {
      console.error(e);
      return await ctx.reply(`${ctx.bold("[ ! ]")} ${e}`);
    }
  },
};

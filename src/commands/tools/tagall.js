export default {
  name: "Tag All (Group Only)",
  triggers: ["everyone", "tagall", "semua"],
  info: {},
  code: async (ctx) => {
    const msg = ctx.msg;
    const sock = ctx.sock;
    try {
      if (await ctx.isGroup(msg)) {
        const groupData = await sock.groupMetadata(
          msg.messages[0].key.remoteJid
        );
        let mentions = [];

        groupData.participants.forEach((participant) => {
          if (sock.user.id.includes(participant.id.split("@")[0])) return;
          mentions.push(participant.id);
        });

        await ctx.reply({
          text: "@everyone",
          mentions: mentions,
          quoted: msg.messages[0],
        });
      } else {
        ctx.reply(
          ctx.bold(
            "[ ! ] Perintah hanya bisa digunakan di dalam Group Whatsapp!"
          )
        );
      }
    } catch (e) {
      ctx.reply(`${ctx.bold("[ ! ]")} ${e}`);
    }
  },
};

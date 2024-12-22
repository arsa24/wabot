export default {
    name: "Bot",
    triggers: ["bot"],
    info: {},
    development: true,
    code: async (ctx) => {
        ctx.reply("Dalam pengembangan")
    }
}
export default {
    name: "Ping",
    triggers: ["ping"],
    info: {},
    development: true,
    code: async (ctx) => {
        ctx.reply("pong")
    }
}
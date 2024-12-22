module.exports = {
    apps: [{
        name: "wa-bot",
        script: "./main.js",

        watch: true,
        ignore_watch: ["node_modules", "state", "database.json"],

        cron_restart: "*/30 * * * *"
    }]
};
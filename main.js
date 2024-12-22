import { CommandHandler } from "./src/lib/CommandHandler.js";
import { CommandLoader } from "./src/lib/CommandLoader.js";
import { conn, sock } from "./src/lib/connection.js";
import path from "path";

const main = async () => {
  const print = new CommandLoader("./src/commands");
  await print.loadCommands();

  await conn();
  const cmd = new CommandHandler(sock, path.resolve("./src/commands"));
  cmd.load();
};

main();

/**
 * note
 * sebagian kode hasil copas dari:
 * https://github.com/kazedepid/whatsapp-bot
 * https://github.com/itsreimau/ckptw-wabot/
 */

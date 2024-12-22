import chalk from "chalk";
import fs from "fs";
import path from "path";

export class CommandLoader {
  constructor(commandPath) {
    this.commandPath = commandPath;
  }

  async getCommands() {
    let files = [];
    let result = [];
    fs.readdirSync(this.commandPath).forEach((file) => {
      const fullPath = path.join(this.commandPath, file);
      const p = fullPath.length < 1 ? undefined : fullPath;

      fs.readdirSync(path.resolve(p)).forEach((cmd) => {
        files.push("/" + file + "/" + cmd);
      });
    });
    for (const file of files) {
      const fullPath = path.resolve(this.commandPath + file);

      if (fs.statSync(fullPath).isFile() && (fullPath.endsWith(".js") || fullPath.endsWith(".cjs"))) {
        try {
          let { default: command } = await import(fullPath);
          const name = command.name;
          const status = command.development;
          const triggers = command.triggers;
          result.push({ name, triggers, status });
        } catch (e) {
          console.error(e);
        }
      }
    }
    return result;
  }

  async loadCommands() {
    console.clear();
    console.log(chalk.blueBright("╔════════════════════════════════════╗"));
    console.log(chalk.blueBright("║            WHATSAPP BOT            ║"));
    console.log(chalk.blueBright("╚════════════════════════════════════╝\n"));

    console.log(chalk.greenBright("📂  Loading Commands...\n"));
    const data = await this.getCommands();
    const commandCount = data.length;
    data.forEach((command, index) => {
      console.log(
        (command.status
          ? chalk.redBright(
              `[loaded] ${command.name} (${
                command.status ? "development" : "stable"
              })`
            )
          : chalk.yellowBright(
              `[loaded] ${command.name} (${
                command.status ? "development" : "stable"
              })`
            )) + chalk.gray(` | Triggers: [${command?.triggers?.join(", ")}]`)
      );
    });

    console.log(
      chalk.greenBright(
        `\n✨ All ${commandCount} commands loaded successfully! 🎉`
      )
    );
  }
}

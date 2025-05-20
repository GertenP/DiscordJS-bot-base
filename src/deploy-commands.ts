import { REST, Routes } from 'discord.js';
import fs from "fs";
import path from "path"
import { config } from "dotenv"


const __dirname: string = import.meta.dirname;
config({ path: "./src/.env" });
const token: string = process.env.TOKEN || "";
const clientId: string = process.env.CLIENT_ID || "";
const guildId: string = process.env.GUILD_ID || "";

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolder = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFolder) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import("file://" + filePath);
    const command = commandModule.default;
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}


const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${(data as Array<unknown>).length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

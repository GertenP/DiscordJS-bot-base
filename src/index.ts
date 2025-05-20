import { Client, Collection, Events, GatewayIntentBits, MessageFlags, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config({path: "./src/.env"});
const token: string = process.env.TOKEN || "";
if (token === "") {
	console.error("Token is not defined in .env file");
}

interface Command{
	data: SlashCommandBuilder,
	execute(interaction: any): Promise<void>
};

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});
client.commands = new Collection();
const __dirname: string = import.meta.dirname;
	const commands: Array<string> = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));
	for (const file of commands) {
		const commandModule = await import("file://" + path.join(__dirname, "commands", file));
		const command: Command = commandModule.default;
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
			console.log("Läks läbi");
		} else {
			console.log("Midagi jäi puudu");
		}
	};

console.log(client.commands);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction.commandName);
	const command = client.commands.get(interaction.commandName);
	if (command) {
		await command.execute(interaction);
	} else {
		console.error(`Command ${interaction.commandName} not found.`);
	}
})


client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
import { Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { ticketModalSubmit } from "./events/ticketModalSubmit.js";
import { closeTicketInteraction } from "./events/closeTicketInteraction.js";
config({ path: "./src/.env" });
const token: string = process.env.TOKEN || "";
if (token === "") {
	console.error("Token is not defined in .env file");
}

interface Command {
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
	} else {
		console.log("Loading commands went wrong");
	}
};

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (command) {
			await command.execute(interaction);
		} else {
			console.error(`Command ${interaction.commandName} not found.`);
		}
	}

	closeTicketInteraction(interaction);

	if (interaction.isModalSubmit()) {
		ticketModalSubmit(interaction);
	}
})


client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
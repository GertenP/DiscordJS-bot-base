import { Client, Events, GatewayActivity, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";

config({path: "./src/.env"});
const token: string = process.env.TOKEN || "";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
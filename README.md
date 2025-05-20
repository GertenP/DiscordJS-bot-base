# Discord template bot

A simple Discord bot template written in TypeScript using [discord.js](https://discord.js.org/). Easily extendable by adding your own slash commands.

## Prerequisites

- Node.js (v22+ recommended)
- A Discord bot token, client ID, and server (guild) ID

## Setup

1. **Clone the repository and install dependencies:**
   ```sh
   git clone <repo-url>
   cd discord-ticket-bot
   npm install
   ```

2. **Create a `.env` file in the `src` folder:**
   ```
   TOKEN=YOUR_BOT_TOKEN
   CLIENT_ID=YOUR_CLIENT_ID
   GUILD_ID=YOUR_GUILD_ID
   ```
   Replace the values with your own.

## Building and Running

1. **Build the project:**
   ```sh
   npm run build
   ```

2. **Deploy commands to Discord:**
   ```sh
   node src/deploy-commands.js
   ```

3. **Start the bot:**
   ```sh
   npm start
   ```

## Adding Your Own Commands

All commands are located in the [`src/commands`](src/commands) folder. Each command is a separate `.ts` file that exports a default object with `data` and `execute` properties.

**Example command file:**

```typescript
// filepath: src/commands/hello.ts
import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("hello")
        .setDescription("Greets the user!"),
    async execute(interaction: any) {
        await interaction.reply("Hello there!");
    }
}```

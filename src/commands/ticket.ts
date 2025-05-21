import { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { config } from 'dotenv';

config({ path: "./src/.env" });
const ticket_category = process.env.TICKET_CATEGORY_ID;
export default {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Opens ticket"),
    async execute(interaction: any) {

        const modal = new ModalBuilder()
            .setCustomId('ticket_modal')
            .setTitle('Ticket system');

        const favoriteColorInput = new TextInputBuilder()
            .setCustomId('header')
            .setLabel("Problem title")
            .setStyle(TextInputStyle.Short);

        const hobbiesInput = new TextInputBuilder()
            .setCustomId('description')
            .setLabel("Describe your problem")
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(hobbiesInput);

        modal.addComponents(firstActionRow, secondActionRow);

        const username_sanitized = [...interaction.user.username].filter(i => /^[a-zA-Z0-9-]$/.test(i)).join("");
        const ticket_category = process.env.TICKET_CATEGORY_ID;
        const channelsInCategory = interaction.guild.channels.cache
            .filter((channel: any) => channel.parentId === ticket_category)
            .map((channel: any) => channel.name);
        const channel_name: string = `${username_sanitized}-ticket`;
        if (channelsInCategory.includes(channel_name)) {
            await interaction.reply({ content: "You already have a ticket.", ephemeral: true });
            return;
        }
        await interaction.showModal(modal);
    }
}
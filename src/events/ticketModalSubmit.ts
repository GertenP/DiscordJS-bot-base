import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Collection, EmbedBuilder, Events, GatewayIntentBits, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";


config({ path: "./src/.env" });
const moderator_role: string = process.env.MODERATOR_ROLE_ID || ""; 

export async function ticketModalSubmit(interaction: any) {
    if (interaction.customId === "ticket_modal") {
        const user = interaction.user.username;
        const problem_title: string = interaction.fields.getTextInputValue("header");
        const problem_description: string = interaction.fields.getTextInputValue("description");
        const username_sanitized = [...user].filter(i => /^[a-zA-Z0-9-]$/.test(i)).join("");
        const ticket_category = process.env.TICKET_CATEGORY_ID;
        try {
            const ticket_channel = await interaction.guild?.channels.create({
                name: `${username_sanitized}-ticket`,
                parent: ticket_category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: moderator_role,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });
            let currentDate = new Date().toJSON().slice(0, 10);
            const embed = new EmbedBuilder()
                .setColor("#ff3926")
                .setTitle("➖ Ticket system")
                .setDescription(`
                        **Title**: ${problem_title}
                        **Description**: ${problem_description}
                        `)
                .setFooter({ text: `${interaction.user.username} • ${currentDate}` });
            const close_button = new ButtonBuilder()
                .setCustomId('close_ticket_button')
                .setLabel('Close ticket')
                .setStyle(ButtonStyle.Danger);

            if (ticket_channel) {
                await ticket_channel.send({
                    embeds: [embed],
                    components: [new ActionRowBuilder().addComponents(close_button).toJSON()],
                });
            } else {
                console.error("Failed to create ticket channel.");
            }

            await interaction.deferUpdate();
        } catch (error) {
            interaction.reply(`Error creating ticket channel: ${error}`);
        }
    }
}
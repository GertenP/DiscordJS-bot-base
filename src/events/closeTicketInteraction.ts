import { ChannelType, EmbedBuilder } from "discord.js";

export async function closeTicketInteraction(interaction: any){
    if(!interaction.isButton()) return;
    if (interaction.customId !== 'close_ticket_button') return;

    try {
        const channel = interaction.channel;
        if (!channel || channel.type !== ChannelType.GuildText) {
            throw new Error("Channel is not a text channel or is undefined.");
        }
        const fetchedMessages = await channel.messages.fetch();
        const lastMessage = Array.from(fetchedMessages.values()).pop();
        if (!lastMessage || typeof lastMessage !== "object" || !("content" in lastMessage)) {
            throw new Error("Last message is not available or does not have content.");
        }
        const content = (lastMessage as { content: string }).content;
        const ticketCreator = await interaction.client.users.fetch(
                content.substring(2, content.length - 1)
            );

        const currentDate = new Date().toLocaleString();
        const embed = new EmbedBuilder()
        .setTitle("❌ Ticket closed")
        .setColor(0xff0000)
        .setFooter({text: `${interaction.guild?.name ?? "Unknown server"} • ${currentDate}`})
        await ticketCreator.send({embeds: [embed]})
        await channel.delete();
    }
    catch (error) {
        console.log(error);
    }
}
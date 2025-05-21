export async function closeTicketInteraction(interaction) {
    if (!interaction.isButton())
        return;
    if (interaction.customId !== 'close_ticket_button')
        return;
    try {
        const channel = interaction.channel;
        await channel.delete();
    }
    catch (error) {
        console.log(error);
    }
}

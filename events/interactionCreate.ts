import { Interaction } from "discord.js";

module.exports = {
	name: 'interactionCreate',
	execute: async(interaction: Interaction) => {
		if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if(!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            try {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
			catch
			{
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			}
        }
    }
};
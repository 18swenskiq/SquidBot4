export {};
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pringle')
		.setDescription('For testing'),
	async execute(interaction: CommandInteraction) {
		await interaction.reply("Seems like it might be unnecessary");
	},
};
export {};
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('For testing'),
	async execute(interaction: CommandInteraction) {
		await interaction.reply("This doesn't do anything");
	},
};
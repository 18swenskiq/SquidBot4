export {};
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nothing')
		.setDescription('even more nothing'),
	async execute(interaction: CommandInteraction) {
		await interaction.reply("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
	},
};
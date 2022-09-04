export {};
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('times')
		.setDescription('Retrieve the current time for registered members of this server'),
	async execute(interaction: CommandInteraction) {
		await interaction.reply("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
	},
};
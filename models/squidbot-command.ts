import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface SquidbotCommand {
    data: SlashCommandBuilder,
    execute: (interaction: CommandInteraction) => void;
}
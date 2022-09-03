import { Client, Collection } from "discord.js";

export class ClientWithCommands extends Client {
	commands: Collection<unknown, any> = new Collection<unknown, any>();
}
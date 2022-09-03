export {};
import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { SquidbotCommand } from './models/squidbot-command';

console.log("-----DEPLOYING SLASH COMMANDS-----");

let discordToken: string;
let discordClientId: string;

if (process.argv.length === 2) {
	console.log("No input arguments found, reading from development config file...");
	const cfgPath = path.resolve(__dirname, "development_config.json");
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { token, clientId } = require(cfgPath);

	discordToken = token;
	discordClientId = clientId;
}
else {
	discordToken = process.argv[2] as string;
	discordClientId = process.argv[3] as string;
}

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const commandsPath = path.resolve(__dirname, "commands/");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log(`Registering ${commandFiles.length} commands...`);
for (const file of commandFiles) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const command: SquidbotCommand = require(`${commandsPath}/${file}`);
	console.log(`Registering ${command.data.name} command`);
	commands.push(command.data.toJSON());
	command.data.toJSON()
}
	
const rest = new REST({ version: '9' }).setToken(discordToken);

rest.put(Routes.applicationCommands(discordClientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.then(() => console.log("-----END DEPLOYING SLASH COMMANDS-----"))
	.then(() => console.log("\n"))
	.catch(console.error);
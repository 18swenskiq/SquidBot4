// Require the necessary discord.js classes
import fs from 'fs';
import path from 'path';
import { Collection, GatewayIntentBits } from 'discord.js';
import { ClientWithCommands } from './models/client-with-commands';

console.log("-----SquidBot 4: The Squiddening-----");
process.argv.forEach(function (val, index, _) {
	console.log(index + ': ' + val);
});

let discordToken: string;

// No token provided, use developer one
if (process.argv.length === 2) {
	const cfgPath = path.resolve(__dirname, "development_config.json");

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { token } = require(cfgPath);
	discordToken = token;
}	
else {
	discordToken = process.argv[2] as string;
}

// Create a new client instance
const client = new ClientWithCommands({ intents: [GatewayIntentBits.Guilds] });

// Set up events
const eventsPath = path.resolve(__dirname, "events/");

const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
console.log(`Loading ${eventFiles.length} events...`);

for (const file of eventFiles) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const event = require(`${eventsPath}/${file}`);

	if (event.once) {
		client.once(event.name, (...args: any) => event.execute(...args));
	} else {
		client.on(event.name, (...args: any) => event.execute(...args));
	}
}
console.log("Done loading events");

// Set up Commands
const commandsPath = path.resolve(__dirname, "commands/");

client.commands = new Collection();
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log(`Loading ${commandFiles.length} commands...`);

for (const file of commandFiles) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const command = require(`${commandsPath}/${file}`);

	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
console.log("Done loading commands");

// Login to Discord with your client's token
client.login(discordToken);
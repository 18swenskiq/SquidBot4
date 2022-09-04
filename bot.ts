// Require the necessary discord.js classes
import fs from 'fs';
import path from 'path';
import { Collection, GatewayIntentBits, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { ClientWithCommands } from './models/client-with-commands';

const registerCommands = (token: string, clientId: string, commands: RESTPostAPIApplicationCommandsJSONBody[]): void => {
	console.log("-----DEPLOYING SLASH COMMANDS-----");
		
	const rest = new REST({ version: '9' }).setToken(token);

	rest.put(Routes.applicationCommands(clientId), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.then(() => console.log("-----END DEPLOYING SLASH COMMANDS-----"))
		.then(() => console.log("\n"))
		.catch(console.error);
}

console.log("-----SquidBot 4: The Squiddening-----");
process.argv.forEach(function (val, index, _) {
	console.log(index + ': ' + val);
});

let discordToken: string;
let discordClientId: string;

// No token provided, use developer one
if (process.argv.length === 2) {
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
const commandsForRegistration: RESTPostAPIApplicationCommandsJSONBody[] = [];

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log(`Loading ${commandFiles.length} commands...`);

for (const file of commandFiles) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const command = require(`${commandsPath}/${file}`);

	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);

	commandsForRegistration.push(command.data.toJSON());
}
console.log("Done loading commands");

registerCommands(discordToken, discordClientId, commandsForRegistration);

function logHeartbeat() {
	console.log(`Heatbeat log -  ${Date.now()}`);
}

setInterval(logHeartbeat, 15 * 1000);

// Login to Discord with your client's token
client.login(discordToken);
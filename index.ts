import { execSync } from "child_process";
import { ChatInputCommandInteraction, Client as BotClient, Routes as BotRoutes } from "discord.js";
import { Client } from "discord.js-selfbot-v13";

const commands = [
	{
		name: "ping",
		description: "Pings the bot and shows the latency",
	},
	{
		name: "command2",
		description: "yes",
	},
];

const botClient = new BotClient({ intents: [] });

botClient.on("interactionCreate", (_interaction) => {
	const interaction = _interaction as ChatInputCommandInteraction;
	if (interaction.commandName === "ping") {
		interaction.reply(
			`Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(
				botClient.ws.ping
			)}ms`
		);
	} else if (interaction.commandName === "command2") {
		// This is the example command's name!
		interaction.reply("example command");
	} else {
		// a response if you forget to add the command here
		interaction.reply("this command's response has not been added yet!");
	}
});

const botToken = process.env.APPLICATION_TOKEN!;

const ratelimitTest = await fetch(`https://discord.com/api/v9/invites/discord-developers`);

if (!ratelimitTest.ok) {
	console.error(
		`Uh oh, looks like the node you're on is currently being blocked by Discord. Press the "Enter" button on your keyboard to be reassigned to a new node. (you'll need to rerun the program once you reconnect)`
	);

	// This kills the container manager on the repl forcing Replit to assign the repl to another node with another IP address (if the ip is globally rate limited)
	//^ in short: Restarts the bot to be used again/attempted to start up again!
	execSync("kill 1");
} else {
	await botClient.login(botToken).catch((err) => {
		throw err;
	});

	await botClient.rest.put(BotRoutes.applicationCommands(botClient.user!.id), { body: commands });

	// console.log(
	// 	"DONE | Application/Bot is up and running. DO NOT CLOSE THIS TAB UNLESS YOU ARE FINISHED USING THE BOT, IT WILL PUT THE BOT OFFLINE."
	// );

	const client = new Client();

	client.on("ready", async () => {
		console.log(`${client.user!.username} is ready!`);

		const channel = client.channels.cache.get(process.env.CHANNEL_ID!)!;
		if (channel.isText()) {
			await channel.sendSlash(botClient.user!.id, "ping");
			await channel.send("DONE!");

			process.exit(0);
		}
	});

	client.login(process.env.TOKEN!);
}

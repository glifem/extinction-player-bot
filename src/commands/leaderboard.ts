import { Command } from 'discord-akairo';
import { MessageAttachment, Message, MessageEmbed } from 'discord.js';
import * as request from "request-promise-native";
import * as Api from "../client/Api";
import { DiscordAPIError } from 'discord.js';
import { STATUS_CODES } from 'http';

export default class ExtinctionLeaderboardCommand extends Command {
	public constructor() {
		super('leaderboard', {
			aliases: ['leaderboard', 'leader'],
			description: {
				content: 'Display Leaderboard of the server',
				usage: 'leaderboard [crews/players] [kill/death/zombie]',
				examples: ['leaderboard crews kill', 'leaderboard players death']
			},
			args: [
				{
					id: 'command',
					type: 'commandAlias'
				}
			]
		});
	}

	public exec(msg: Message, { command }: { command: Command }): void {

		const { prefix } = this.client.discord
		let args = msg.content.slice(prefix.length).trim().split(/ +/g);
		if (!args[1] || !args[2])
		{
			msg.channel.send(`Usage : ${prefix}leaderboard [crews/players] [kill/death]`);
			return;
		}
		(async () => {
			var options = {
				uri: `https://api.gtaliferp.fr:8443/v1/extinction/leaderboard/${args[1]}/${args[2]}`,
			};
			const result = await request.get(options);
			//const result = getExtinctionProfileWithCharacterId("77913");
			let list = JSON.parse(result);
			let str = "";
			for (let i = 0; i < 10; i++)
			{
				str += `${i + 1}. ${list[i].name} - ${list[i].stats} ${args[2]}s\n`;
			}
			let embed = new MessageEmbed()
				.setAuthor(msg.author.tag)
				.setTitle(`Top ${args[1]} for ${args[2]}s`)
				.setDescription(str)
				.setColor("BLUE")
			msg.channel.send(embed);
		})()
	}
}

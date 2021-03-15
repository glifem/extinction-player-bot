import { Command } from 'discord-akairo';
import { MessageAttachment, Message, MessageEmbed } from 'discord.js';
import * as request from "request-promise-native";
import * as Api from "../client/Api";
import { DiscordAPIError } from 'discord.js';

function foundstats(list: any, name: any) {

	for (let i = 0; i < list.stats.length; i++) {
		if (list.stats[i].name == name)
			return (list.stats[i].value)
	}
	return ("N/A");
}

export default class ExtinctionStatsCommand extends Command {
	public constructor() {
		super('time', {
			aliases: ['time'],
			description: {
				content: 'Display playtime for a player',
				usage: 'time [CharID/Name]',
				examples: ['time PichotM', 'time 77913']
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
		(async () => {
			var options = {
				uri: `https://api.gtaliferp.fr:8443/v1/extinction/profiles/main/${args[1]}`,
			};
			const result = await request.get(options);
			//const result = getExtinctionProfileWithCharacterId("77913");
			let list = JSON.parse(result);
			let time = foundstats(list, "played_time");
			var w = Math.floor(time / (3600 * 24 * 7));
			var d = Math.floor(time / (3600 * 24) - (w * 7));
			var h = Math.floor((time - w * 3600 * 24 * 7 - d * 3600 * 24) % (3600 * 24) / 3600);
			var m = Math.floor(time % 3600 / 60);
			var s = Math.floor(time % 60);
			var wDisplay = w > 0 ? w + "w " : "";
			var dDisplay = d > 0 ? d + "d " : "";
			var hDisplay = h > 0 ? h + "h " : "";
			var mDisplay = m > 0 ? m + "m " : "";
			var sDisplay = s > 0 ? s + "s " : "";
			let embed = new MessageEmbed()
				.setAuthor(msg.author.tag)
				.setTitle("Time")
				.setColor("BLUE")
				.addField("Character", list.name, true)
				.addField("Playtime", wDisplay + dDisplay + hDisplay + mDisplay + sDisplay, true)
			if (msg.util) msg.util.send(embed);
		})()
	}
}

import { Command } from 'discord-akairo';
import { MessageAttachment, Message } from 'discord.js';
import * as request from "request-promise-native";
import * as Api from "../client/Api";

import { imageCreation } from '../utils/imageCreation';

function foundstats(list: any, name: any) {

    for (let i = 0; i < list.stats.length; i++)
    {
        if (list.stats[i].name == name)
            return (list.stats[i].value)
    }
    return ("N/A");
}

export default class ExtinctionStatsCommand extends Command {
    public constructor() {
        super('bs', {
            aliases: ['bs', 'bstats'],
            description: {
                content: 'Display stats for a player',
                usage: 'bs [name]',
                examples: ['bs PichotM', 'bs']
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
        console.log(result)
        let list = JSON.parse(result);
        console.log(list)
        imageCreation.createStatsCard(
            {
                name: list.name,
                playtime: (foundstats(list, "played_time") / 3600).toFixed(2),
                level: list.rank,
                global_kd: foundstats(list, "ratio"),
                global_kills: foundstats(list, "kill"),
                global_deaths: foundstats(list, "death"),
                redzone_kd: foundstats(list, "kill_redzone") / foundstats(list, "death_redzone"),
                redzone_kills: foundstats(list, "kill_redzone"),
                redzone_deaths: foundstats(list, "death_redzone"),
                darkzone_kd: foundstats(list, "kill_darkzone") / foundstats(list, "death_darkzone"),
                darkzone_kills: foundstats(list, "kill_darkzone"),
                darkzone_deaths: foundstats(list, "death_darkzone")
            },
            (error: any, buffer: any) => {
                if (error) throw error;
                const attachment = new MessageAttachment(buffer, 'image.png');
                if (msg.util) msg.util.send(attachment);
            }
        );
    })()
    }
}

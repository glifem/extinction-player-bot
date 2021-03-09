import { Command } from 'discord-akairo';
import { MessageAttachment, Message } from 'discord.js';

import { imageCreation } from '../utils/imageCreation.ts';

export default class ExtinctionStatsCommand extends Command {
    public constructor() {
        super('es', {
            aliases: ['es', 'estats'],
            description: {
                content: 'Display stats for a player',
                usage: 'es [name]',
                examples: ['es PichotM', 'es']
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
        imageCreation.createStatsCard(
            {
                name: 'Levino',
                playtime: '5000h',
                level: 24,
                global_kd: '2.0',
                global_kills: 14582,
                global_deaths: 1258,
                redzone_kd: '2.0',
                redzone_kills: 14582,
                redzone_deaths: 1258,
                darkzone_kd: '2.0',
                darkzone_kills: 14582,
                darkzone_deaths: 1258
            },
            (error: any, buffer: any) => {
                if (error) throw error;
                const attachment = new MessageAttachment(buffer, 'image.png');
                if (msg.util) msg.util.send('Hello', attachment);
            }
        );
    }
}

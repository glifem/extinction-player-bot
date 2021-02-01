import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class HelpCommand extends Command {
    public constructor() {
        super('help', {
            aliases: ['help'],
            description: {
                content: 'Display help for available commands',
                usage: 'help [command]',
                examples: ['help es', 'help']
            },
            args: [
                {
                    id: 'command',
                    type: 'commandAlias'
                }
            ]
        });
    }

    public exec(msg: Message, { command }: { command: Command }): Promise<Message | void> {
        if (!command) {
            return this.defaultHelp(msg);
        }

        const { prefix } = this.client.discord;
        const { examples } = command.description;

        // Build stylish embed
        const embed = new MessageEmbed()
            .setTitle(`${prefix}${command}`)
            .setDescription(command.description.content)
            .setTimestamp(Date.now())
            .setColor('#fd8602');

        if (command.description.usage ? command.description.usage : '') {
            embed.addField('Usage', `${prefix}${command.description.usage}`);
        }

        if (command.aliases.length > 1) {
            embed.addField(
                'Alias',
                command.aliases
                    .slice(1)
                    .map((a) => `\`${a}\``)
                    .join(', ')
            );
        }

        if (examples) {
            embed.addField('Examples', examples.map((e: string) => `${prefix}${e}`).join('\n'));
        }

        return msg.util ? msg.util.send(embed) : Promise.resolve();
    }

    private async defaultHelp(message: Message): Promise<Message | void> {
        const { prefix } = this.client.discord;
        const embed = new MessageEmbed()
            .setTitle('Help!')
            .setDescription([
                message.guild ? `The commands prefix is \`${prefix}\`` : '',
                `If you need help about a command, types \`${prefix}help [command name]\``
            ]);

        this.handler.categories.array().forEach((value) => {
            const commands = value.array();
            const category = value.id;

            let catCommands = commands.filter((cmd) => Boolean(cmd.aliases && cmd.aliases.length));
            if (!message.guild) catCommands = catCommands.filter((cmd) => cmd.channel !== 'guild');
            if (catCommands.length) {
                embed.addField(
                    category,
                    catCommands.map((cmd) => `\`${cmd.aliases[0]}\``).join(', ')
                );
            }
        });

        embed.fields = embed.fields.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;

            return 0;
        });

        return message.util ? message.util.send(embed) : Promise.resolve();
    }
}

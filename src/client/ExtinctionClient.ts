import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import axios, { AxiosInstance } from 'axios';
import { join } from 'path';
import { BotOptions, DiscordOptions } from '../constants.ts';

declare module 'discord-akairo' {
    interface AkairoClient {
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
        axios: AxiosInstance;
        discord: DiscordOptions;
    }
}

export default class ExtinctionClient extends AkairoClient {
    private botConfig: BotOptions;

    public listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, '..', 'events')
    });

    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, '..', 'commands'),
        allowMention: false,
        handleEdits: false,
        commandUtil: true,
        commandUtilLifetime: 3e5,
        defaultCooldown: 2e2
    });

    public axios: AxiosInstance;

    get discord(): DiscordOptions {
        return this.botConfig.discord;
    }

    public constructor(config: BotOptions) {
        super({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

        this.botConfig = config;
        this.commandHandler.prefix = this.botConfig.discord.prefix;

        this.axios = axios.create();
    }

    private async init(): Promise<void> {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            process
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    public async start(): Promise<string> {
        // TODO: Add debug logs mode
        console.log('Initializing...');
        await this.init();
        console.log('ExtinctionClient is initialized');
        return this.login(this.botConfig.discord.token);
    }
}

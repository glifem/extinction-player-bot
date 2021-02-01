export enum Endpoints {
    GETALL = 'health/getall'
}

export interface DiscordOptions {
    token: string;
    prefix: string;
}

export interface BotOptions {
    discord: DiscordOptions;
}

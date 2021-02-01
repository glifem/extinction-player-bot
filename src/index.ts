// Imports
import ExtinctionClient from './client/ExtinctionClient.ts';
import botConfig from './config.ts';

// Instantiate and start bot
const client: ExtinctionClient = new ExtinctionClient(botConfig);
client.start();

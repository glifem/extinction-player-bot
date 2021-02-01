import * as dotenv from 'dotenv';
import { join } from 'path';

// Load env variables
dotenv.config({ path: join(__dirname, '..', '.env') });

export default {
    isDev: process.env.NODE_ENV === 'development',
    discord: {
        token: process.env.DISCORD_TOKEN ?? 'hello',
        prefix: process.env.PREFIX ?? '!'
    }
};

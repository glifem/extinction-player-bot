import axios from 'axios';

const apiLink = process.env.API_URL;
const apiInstance = axios.create({ baseURL: apiLink, timeout: 7000 });

abstract class Api {
    getExtinctionProfileWithCharacterId(characterId: string) {
        return apiInstance({ method: 'GET', url: `extinction/profiles/main/${characterId}` });
    }

    getExtinctionProfileWithDiscordId(discord: string) {
        return apiInstance({ method: 'GET', url: `extinction/profiles/discord/${discord}` });
    }

    getExtinctionProfileWithName(name: string) {
        return apiInstance({ method: 'GET', url: `extinction/profiles/name/${name}` });
    }
}

export default Api;

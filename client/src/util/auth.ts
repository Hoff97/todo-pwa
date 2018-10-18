import { axios } from 'src/rest/config';
import { registerPush } from 'src/registerServiceWorker';

const accessTokenLS = 'at';

export function setAccessToken(token: string) {
    localStorage.setItem(accessTokenLS, token);
    axios.defaults.headers = {
      'x-auth-token': token
    }
    registerPush();
}

export function getAccessToken() {
    const token = localStorage.getItem(accessTokenLS) as string;
    axios.defaults.headers = {
      'x-auth-token': token
    }
    return token;
}

export function setupAccessToken() {
    const token = getAccessToken();
    if(token !== null && token !== undefined && token !== '') {
        registerPush();
    }
    return token;
}
import { axios } from './config';

export function getVapidKey() {
    return axios.get('/api/v1/push/vapid').then(response => response.data);
}

export function registerSubscription(subscription: PushSubscription, deviceDescription: string) {
    return axios.post('/api/v1/push/register', {
        subscription,
        deviceDescription
    });
}
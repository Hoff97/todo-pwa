import { axios } from './config';

// TODO: Implement these in the backend
export function getVapidKey() {
    return axios.get('/api/v1/push/vapid').then(response => response.data);
}

export function registerSubscription(subscription: PushSubscription) {
    return axios.post('/api/v1/push/register', {
        subscription: subscription
    });
}
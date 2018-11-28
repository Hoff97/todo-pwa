import { axios } from './config';
import moment from 'moment';
import { Sub } from 'src/types';

const timeFormat = 'HH:mm'

export function loginRequest(mail: string, pw: string) {
    return axios.post('/api/v1/login/signIn', {
        email: mail,
        password: pw,
        rememberMe: true
    }).then(response => {
        return response.data.token;
    })
}

export function signUpRequest(mail: string, pw: string) {
    return axios.post('/api/v1/login/signUp', {
        email: mail,
        password: pw,
        repeatedPassword: pw
    }).then(response => {
        return response.data.token;
    })
}

const tExpr = /(\d{1,2}):(\d{2,2})/

export function updateUserSettings(mail: boolean, time?: moment.Moment) {
    return axios.post('/api/v1/login/settings', {
        notificationTime: time ? time.format(timeFormat) : undefined,
        mail
    }).then(response => {
        var tParse = undefined;
        if(response.data.notificationTime) {
            let match = (response.data.notificationTime as string).match(tExpr);
            if(match !== null) {
                tParse = moment().hour(+match[1]).minute(+match[2]).second(0);
            }
        }
        return {
            mail: response.data.mail as boolean,
            time: tParse
        }
    })
}

export function getUserSettings() {
    return axios.get('/api/v1/login/settings').then(response => {
        var tParse = undefined;
        if(response.data.notificationTime) {
            let match = (response.data.notificationTime as string).match(tExpr);
            if(match !== null) {
                tParse = moment().hour(+match[1]).minute(+match[2]).second(0);
            }
        }
        return {
            mail: response.data.mail as boolean,
            time: tParse
        }
    })
}

export function getDevicesR() {
    return axios.get<Sub[]>('/api/v1/push/register').then(x => x.data);
}

export function deleteSubscriptionR(id: string) {
    return axios.delete(`/api/v1/push/register/${id}`);
}
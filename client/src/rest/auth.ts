import { axios } from './config';

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
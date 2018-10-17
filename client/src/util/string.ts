export function longestPreSuffix(str1: string, str2: string) {
    for (let i = str2.length; i > 0; i--) {
        if (str1.endsWith(str2.substring(0, i))) {
            return i;
        }
    }
    return 0;
}

export function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
export function longestPreSuffix(str1: string, str2: string) {
    for(let i = str2.length; i>0; i--) {
        if(str1.endsWith(str2.substring(0,i))) {
            return i;
        }
    }
    return 0;
}
const urls = ['192.168.157.81', 'localhost']

// url test
export const SERVER_URL: string = urls.some(url => window.location.href.includes(url)) ? 'https://192.168.157.81/isrTicketingTest/v1/' : 'https://10.10.81.81/isrTicketingTest/v1/'
export const SERVER_CODE_URL: string = urls.some(url => window.location.href.includes(url)) ? 'https://192.168.157.81/BusDriverCodeGeneratorTest/' : 'https://10.10.81.81/BusDriverCodeGeneratorTest/'

// url production
// export const SERVER_URL: string = urls.some(url => window.location.href.includes(url)) ? 'https://192.168.157.81/isrTicketing/v1/' : 'https://10.10.81.81/isrTicketing/v1/'
// export const SERVER_CODE_URL: string = urls.some(url => window.location.href.includes(url)) ? 'https://192.168.157.81/BusDriverCodeGenerator/' : 'https://10.10.81.81/BusDriverCodeGenerator/'

export var OPERATOR = {
    APP_NAME: 'מחשבון סיסמה',
    OPERATOR_ID: '4',
    LOGO: 'assets/logos/egged-taabura.png',
    SERVER_URL: SERVER_URL,
    SERVER_CODE_URL: SERVER_CODE_URL
}
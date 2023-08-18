const urls = ['192.168.157.81', 'localhost']

// url test
// export const SERVER_URL: string = urls.some(url => window.location.href.includes(url)) ? 'https://192.168.157.81/isrTicketingTest/v1/' : 'https://10.10.81.81/isrTicketingTest/v1/'
// export const SERVER_URL = 'https://cirtus.egged-taavura.co.il/isrTicketingTest/v1/'

// url production
// export const SERVER_URL: string = urls.some(url => window.location.href.includes(url)) ? 'https://192.168.157.81/isrTicketing/v1/' : 'https://10.10.81.81/isrTicketing/v1/'
export const SERVER_URL = 'https://cirtus.egged-taavura.co.il/isrTicketing/v1/'

export var OPERATOR = {
    OPERATOR_ID: '4',
    LOGO: 'assets/logos/egged-taabura.png',
    SERVER_URL: SERVER_URL,
    BACKUP_CARD: true,
    MAGNETIC_ENCODER: true,
    CARD_IMAGE: 'assets/cards/taavura-card.png'
}

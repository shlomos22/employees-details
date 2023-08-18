export const ROOT_URL = '/'
const urls = ['192.168.157.81', 'localhost']
// url test
// export const SERVER_URL: string = urls.some(url => window.location.href.includes(url)) ? 'https://192.168.157.81/isrTicketingTest/v1/' : 'https://10.10.81.81/isrTicketingTest/v1/'
export const SERVER_URL = 'https://cirtus.egged-taavura.co.il/isrTicketing/v1/'

// url production
// export const SERVER_URL: string = urls.some(url => window.location.href.includes(url)) ? 'https://192.168.157.81/isrTicketing/v1/' : 'https://10.10.81.81/isrTicketing/v1/'

export const OPERATOR_ID: string = '4'


export const OK: string = '1'
export const ERROR_EXCEPTION_FROM_SERVER: string = '3'
export const EXCEPTION_FROM_MYDB: string = '4'
export const SESSION_FOR_UID_NOT_LOGIN: string = '5'
export const NO_PERMISSION: string = '6'
export const SESSION_OR_UID_NOT_EXIST: string = '7'
export const ERROR_GET_DRIVER_DETAILS: string = '9'
export const DRIVER_NOT_EXISTS: string = '10'
export const DRIVER_EXISTS_FOR_ANOTHER_OERATOR: string = '11'
export const DRIVER_NOT_ACTIVE: string = '12'
export const CODE_NOT_CORRECT: string = '13'
export const ERROR_TO_UPDATE_EMPLOYEE: string = '23'
export const EMPLOYEE_NOT_FOUND: string = '24'
export const ERROR_TO_SIGN_IN: string = '26'
export const ERROR_TRY_TO_SEND_FOR_FIREBASE: string = '27'
export const ERROR_FROM_FIREBASE: string = '28'

export const NEW_DEVICE: string = '5'
export const DEVICE_BE_ACTIVE: string = '4'

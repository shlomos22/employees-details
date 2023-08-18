import { Injectable } from '@angular/core'
import * as moment from 'moment'

export interface ReadDriverCard {
  command: string
  lang: number
}

export interface WriteDriverCard {
  command: string
  driverEnviroment: DriverEnviroment
  driverHeader: DriverHeader
  driverShifts: object[]
}

export interface DriverEnviroment {
  envCountryID: number,
  envApplicationVersionNumber: number,
  employeeRole2Code: number,
  employeeRole2Date: string,
  employeeLanguage: number,
  envEndDate: string,
  envIssuingDate: string,
  employeeIdNumber: number,
  envIssuerId: number,
  employeePinCode: number,
  employeeRole1Date: string,
  employeeRole1Code: number,
  employeeIsBackUpCard: number,
  employeeIdBackUpCard: number
}

export interface DriverHeader {
  CRC16: number,
  cancelSum: number,
  dateOfFirstShiftOnCard: string,
  lastDriverShiftNum: number,
  lastUnloadingDate: string,
  lastUnloadingCashierNum: number,
  numOfLoadings: number,
  numOfOtherProducts: number,
  numOfCancledTickets: number,
  lastShiftwritten2Crd: number,
  redemption: number,
  shiftMask: string,
  numOfTickets: number,
  numOfIDFVouchers: number
}

@Injectable({
  providedIn: 'root'
})
export class CardReaderService {

  public writeDriverCard: WriteDriverCard

  constructor() {
    this.writeDriverCard = {
      command: 'writeIsrDriverCard',
      driverEnviroment: {
        envCountryID: 886,
        envApplicationVersionNumber: 2,
        employeeRole2Code: 8,
        employeeRole2Date: '1997-01-02',
        employeeLanguage: 1,
        envEndDate: '1997-01-01',
        envIssuingDate: '1997-01-01',
        employeeIdNumber: 123456789,
        envIssuerId: 0,
        employeePinCode: 0,
        employeeRole1Date: '1997-01-01',
        employeeRole1Code: 0,
        employeeIsBackUpCard: 0,
        employeeIdBackUpCard: 0
      },
      driverHeader: {
        CRC16: 0,
        cancelSum: 0,
        dateOfFirstShiftOnCard: '1997-01-01T00:00:00',
        lastDriverShiftNum: 0,
        lastUnloadingDate: moment().format('1997-01-01T00:00:00'),
        lastUnloadingCashierNum: 0,
        numOfLoadings: 0,
        numOfOtherProducts: 0,
        numOfCancledTickets: 0,
        lastShiftwritten2Crd: 0,
        redemption: 0,
        shiftMask: '0000000000000000',
        numOfTickets: 0,
        numOfIDFVouchers: 0
      },
      driverShifts: [null, null, null, null, null, null, null, null, null, null, null, null]
    }
  }

  public getWriteDriverCard(): WriteDriverCard {
    return this.writeDriverCard
  }

}

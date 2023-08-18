import { Injectable } from '@angular/core'
import * as moment from 'moment'
import GlobalDataResponse from '../../../model/inbound-payload/GlobalDataResponse'

import { NavController } from '@ionic/angular';
import EmployeeDetailsPayload from '../../../model/outbound-payload/EmployeeDetailsPayload';

export interface CardDataInput {
  key?: string
  value: string
  type?: string
  disabled?: boolean
}

export interface Employee {
  employeePinCode: CardDataInput
  envIssuingDate: CardDataInput
  envEndDate: CardDataInput
  employeeRole1Code: CardDataInput
  employeeRole1Date: CardDataInput
  employeeRole2Code: CardDataInput
  employeeRole2Date: CardDataInput
  employeeMainLanguage: CardDataInput
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  cardDataInputs: Employee
  language: Map<string, string> = new Map()

  pinCode: string
  issuingDate: string
  endDate: string
  role1Code: string
  role1CodeType: string
  role1Date: string
  role2Code: string
  role2CodeType: string
  role2Date: string
  mainLanguage: string
  backUpCard: string = 'false'
  firstName: string
  lastName: string
  idNumber: string
  cardStatus: string
  cardSerial: string

  constructor(private navController: NavController,) {
    this.language.set('1', 'עברית')
    this.language.set('2', 'אנגלית')
  }

  public setEmployeeDetails(res: GlobalDataResponse) {

    const data: EmployeeDetailsPayload[] = res.data
    this.pinCode = data[0].PIN_Code
    this.issuingDate = this.convertDate(moment().format('YYYY-MM-DD HH:mm:ss'))
    this.endDate = this.convertDate(data[0].typeEnd)
    this.role1Code = data[0].Type_Desc
    this.role1CodeType = data[0].Type_id
    this.role1Date = this.convertDate(data[0].typeEnd)
    this.role2Code = data[1] !== undefined ? data[1].Type_Desc : ''
    this.role2CodeType = data[1] !== undefined ? data[1].Type_id : ''
    this.role2Date = data[1] !== undefined ? this.convertDate(data[1].typeEnd) : ''
    this.mainLanguage = this.language.get(data[0].Lang)

    this.firstName = data[0].FirstName
    this.lastName = data[0].LastName

    this.cardSerial = data[0].Card_serial
    this.cardStatus = data[0].Card_Status

    this.idNumber = data[0].idNumber

    this.loadCardDataInputs()

  }

  private loadCardDataInputs(): Employee {
    return this.cardDataInputs = {
      employeePinCode: { key: 'employeePinCode', value: this.pinCode, type: 'password', disabled: true },
      envIssuingDate: { key: 'envIssuingDate', value: this.issuingDate, type: 'text', disabled: true },
      employeeRole1Code: { key: 'employeeRole1Code', value: this.role1Code, type: 'text', disabled: true },
      employeeRole1Date: { key: 'employeeRole1Date', value: this.role1Date, type: 'text', disabled: true },
      employeeRole2Code: { key: 'employeeRole2Code', value: this.role2Code, type: 'text', disabled: true },
      employeeRole2Date: { key: 'employeeRole2Date', value: this.role2Date, type: 'text', disabled: true },
      employeeMainLanguage: { key: 'employeeMainLanguage', value: this.mainLanguage, type: 'text', disabled: true },
      envEndDate: { key: 'envEndDate', value: this.endDate, type: 'text', disabled: true }
    }
  }

  public getUserName(): string {
    return this.firstName + " " + this.lastName
  }

  public getEmployeeCardData(): Employee {
    if (!this.cardDataInputs) {
      this.navController.navigateRoot('home', { replaceUrl: true })
      return this.loadCardDataInputs()
    }

    return this.cardDataInputs
  }

  public clearAll(): void {

    this.pinCode = ''
    this.issuingDate = ''
    this.role1Code = ''
    this.role1Date = ''
    this.role2Code = ''
    this.role2Date = ''
    this.mainLanguage = ''

    this.firstName = ''
    this.lastName = ''

    this.cardSerial = ''
    this.cardStatus = ''

    this.idNumber = ''

    this.cardDataInputs = null
  }

  private convertDate(date: string): string {
    return moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
  }

  public getNumber(value: string): number {
    return parseInt(value, 10)
  }

  public getRoleCode(value: string): number {
    return value !== '' ? parseInt(value, 10) : 8
  }

  public getDate(date: string): string {
    if (date.includes('2099'))
      date = '31/12/2039'
    return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
  }

  public getRoleDate(date: string): string {
    if (date.includes('2099'))
      date = '31/12/2039'
    return date !== '' ? moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD') : '1997-01-02'
  }

  public getLanguage(lang: string): number {
    return parseInt([...this.language].find(([key, val]) => val === lang)[0])
  }



}

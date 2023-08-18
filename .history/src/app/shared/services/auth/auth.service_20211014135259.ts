import { Injectable } from '@angular/core'




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginSource: string = '9'
  loginStatus: 'CONNECTED' | 'NOT_CONNECTED' = 'NOT_CONNECTED';
  typeRoleId: string[]

  constructor(
  ) { }




}

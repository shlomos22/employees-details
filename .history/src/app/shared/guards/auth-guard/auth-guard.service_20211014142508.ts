import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { OPERATOR } from '../../constants/Config';
import { AuthService } from '../../services/auth/auth.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private navController: NavController
  ) { }




  canActivate(


    // tslint:disable-next-line: variable-name
    _route: ActivatedRouteSnapshot,
    // tslint:disable-next-line: variable-name
    _state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (this.authService.loginStatus === 'CONNECTED' && this.checkTypeRoleId()) {
      return true
    } else {
      const operatorId = OPERATOR.OPERATOR_ID
      this.navController.navigateRoot('login/' + operatorId, { replaceUrl: true });
      return false;
    }
  }

  private checkTypeRoleId(): boolean {
    if (!this.authService.typeRoleId) {
      return false
    }
    debugger
    if (this.authService.typeRoleId.includes('3') || this.authService.typeRoleId.includes('5')) {
      return true;
    } else {
      return false;
    }
  }

}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('auth_token');
  
    if (token && this.isTokenValid(token)) {
      return true;
    } else {
      return this.router.createUrlTree(['auth/login'], { queryParams: { returnUrl: state.url } });
    }
  }
  
  isTokenValid(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    return decodedToken && decodedToken.exp > Date.now() / 1000;
  }
  
  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
}
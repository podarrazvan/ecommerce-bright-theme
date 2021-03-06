import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';

import { User } from './user.model';
import {
  AuthResponseData,
  AuthUserInfoDto,
  AutoLogout,
  Logout,
  NewUserDto,
} from './entities';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject$ = new BehaviorSubject<User>(null);
  public user$: Observable<User> = this.userSubject$.asObservable();

  tokenExpirationTimer; // ! NOT USED!

  constructor(private http: HttpClient, private router: Router) {}

  signup(newUser: NewUserDto, addAdmin): any {
    if (addAdmin) {
      return this.http
        .post<AuthResponseData>(`${environment.api}/users/admins/signup`, {
          ...newUser,
          returnSecureToken: true,
        })
        .pipe(
          catchError(this.handleError),
          tap<AuthResponseData>((resData) => {
            this.handleAuthentication(resData);
          })
        );
    } else {
      return this.http
        .post<AuthResponseData>(`${environment.api}/users/signup`, {
          ...newUser,
          returnSecureToken: true,
        })
        .pipe(
          catchError(this.handleError),
          tap<AuthResponseData>((resData) => {
            this.handleAuthentication(resData);
          })
        );
    }
  }

  login(email: string, password: string): any {
    return this.http
      .post<AuthResponseData>(`${environment.api}/users/login`, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap<AuthResponseData>((resData) => {
          this.handleAuthentication(resData);
        })
      );
  }

  autoLogin(): any {
    const userData: AutoLogout = JSON.parse(localStorage.getItem('userData'));
    const expirationDuration =
      new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    if (expirationDuration < 0) {
      this.logout();
      return;
    }
    if (!userData) {
      return;
    }
    const {
      email,
      password,
      id,
      history,
      categories,
      favorites,
      _token,
      _tokenExpirationDate,
      isAdmin,
    } = userData;

    const loadedUser = new User(
      email,
      password,
      id,
      categories,
      history,
      favorites,
      isAdmin,
      _token,
      new Date(_tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.userSubject$.next(loadedUser);
      this.autoLogout(expirationDuration);
    }
  }

  public handleAuthentication(authUserInfo: AuthUserInfoDto): void {
    const {
      email,
      password,
      id,
      history,
      categories,
      favorites,
      isAdmin,
      token,
      expiresIn,
    } = authUserInfo;
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(
      email,
      password,
      id,
      history,
      categories,
      favorites,
      isAdmin,
      token,
      expirationDate
    );
    this.userSubject$.next(user);
    this.autoLogout(+expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logout(): void {
    this.userSubject$.next(null);
    const userData: Logout = JSON.parse(localStorage.getItem('userData'));
    this.updateUser(userData);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  updateUser(updateUser: AuthUserInfoDto): void {
    const {
      email,
      password,
      id,
      history,
      categories,
      favorites,
      isAdmin,
      token,
    } = updateUser;
    const user = new User(
      email,
      password,
      id,
      history,
      categories,
      favorites,
      isAdmin,
      token
    );
    this.http.put(`${environment.api}/users/update`, user).subscribe();
  }

  private handleError(errorRes: HttpErrorResponse): any {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}

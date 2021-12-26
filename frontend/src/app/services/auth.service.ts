import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import * as moment from "moment";
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth$ = new BehaviorSubject<boolean>(false);
  token: string;
  userId: string;
  userEmail: string;

  constructor(private router: Router,
              private http: HttpClient) { }

  createNewUser(email: string, password: string, role: string) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:4200/api/auth/signup',
        {
          email: email,
          password: password,
          role: role
        })
        .subscribe(
          () => {
            this.login(email, password).then(
              () => { resolve(); }
            ).catch(
              (error) => { reject(error); }
            );
          }, (error) => {
            reject(error);
          }
        );
    });
  }


  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:4200/api/auth/login',
        { email: email, password: password })
        .subscribe(
          (data: { token: string, userId: string, expiresIn: string }) => {
            this.token = data.token;
            this.userId = data.userId;
            this.userEmail = email;
            this.isAuth$.next(true);
            localStorage.setItem('token', data.token);
            const expiresAt = moment().add(data.expiresIn, 'second');
            localStorage.setItem('expiresAt', JSON.stringify(expiresAt.valueOf()));
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  relogin() {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:4200/api/profile/' +
                    this.getDecodedUserId()).subscribe(
        (response) => {
          this.token = localStorage.getItem('token');
          this.userId = (<any>response)._id;
          this.userEmail = (<any>response).email;
          this.isAuth$.next(true);
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  logout() {
    this.isAuth$.next(false);
    this.userId = null;
    this.userEmail = null;
    this.token = null;

    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
  }

  getExpiration() {
    const expiration = localStorage.getItem('expiresAt');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getDecodedUserId(): any {
   try{
     const data = jwt_decode(localStorage.getItem('token'));
     return (<any>data).userId;
   }
   catch(Error){
     return null;
   }
 }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private auth: AuthService,) { }

  getUsers() {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:4200/api/users').subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getRoles() {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:4200/api/roles').subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getUserById(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:4200/api/profile/' + id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  modifyUserById(id: string, email: string, password: string, role: string) {
    return new Promise((resolve, reject) => {
      var user: any = {};
      if (password == null) {
        user = {
          email: email,
          role: role
        }
      } else {
        user = {
          email: email,
          password: password,
          role: role
        }
      }
      this.http.put('http://localhost:4200/api/profile/' + id, user)
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getFriendsByEmail(email: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:4200/api/friends/' + email).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  addFriend(id: string) {
    return new Promise((resolve, reject) => {
      this.http.put(
        'http://localhost:4200/api/friends/add',
        { email: this.auth.userEmail , id: id }
      ).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  removeFriend(id: string) {
    return new Promise((resolve, reject) => {
      this.http.put(
        'http://localhost:4200/api/friends/remove',
        { email: this.auth.userEmail , id: id }
      ).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}

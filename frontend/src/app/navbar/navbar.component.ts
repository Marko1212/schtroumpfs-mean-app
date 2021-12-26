import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAuth: boolean;
  loggedInUserEmail: string;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.auth.isAuth$.subscribe(
      (auth) => {
        this.isAuth = auth;
        this.loggedInUserEmail = this.auth.userEmail;
      }
    );
  }

  onLogout() {
    this.auth.logout();
  }

  profile() {
    if (this.auth.userId != null)
      this.router.navigate(['/profile/' + this.auth.userId]);
    else
      this.router.navigate(['/']);
  }

}

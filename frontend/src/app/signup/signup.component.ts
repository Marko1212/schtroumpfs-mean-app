import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;
  roles: any = [];

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private auth: AuthService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getRoles().then(roles => {
      this.roles = roles;
      this.roles = this.roles.filter(role => role !== null);
    })
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      role: [null]
    });
  }

  onSignup() {
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    const role = this.signupForm.get('role').value;
    this.auth.createNewUser(email, password, role).then(
      () => {
        this.router.navigate(['/']);
      }
    ).catch(
      (error) => {
        this.errorMessage = error.error.error.message;
      }
    );
  }

  get f() { return this.signupForm.controls; }
}

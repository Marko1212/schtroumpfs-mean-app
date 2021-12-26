import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {

  editForm: FormGroup;
  loading = false;
  roles: any = [];

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private userService: UserService,
              private location: Location) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(
      (params: Params) => {
        this.userService.getRoles().then(roles => {
          this.roles = roles;
          this.roles = this.roles.filter(role => role !== null);
        })
        this.userService.getUserById(params.id).then(
          data => {
            this.editForm = this.formBuilder.group({
              email: [{value: (<any>data).email, disabled: true}],
              password: [null, Validators.minLength(8)],
              role: [(<any>data).role]
            });
            this.loading = false;
          }
        )
      }
    )
  }

  onEdit() {
    const email = this.editForm.get('email').value;
    const password = this.editForm.get('password').value;
    const role = this.editForm.get('role').value;
    this.userService.modifyUserById(this.auth.userId, email, password, role).then(
      () => {
        this.location.back();
      }
    ).catch(
      (error) => { console.log(error) }
    );
  }

  onCancel() {
    this.location.back();
  }

}

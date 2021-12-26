import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

import * as $ from 'jquery';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  friends: any[] = [];
  friendsLoading = false;
  users: any = [];

  constructor(private auth: AuthService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.updateFriendsList();


    this.userService.getUsers().then(users => {
      this.users = users;
      this.users = this.users.filter(user => user.email !== this.auth.userEmail);
    })
    .catch((error) => { console.log(error) });
  }

  onUserClick(id: string) {
    if (id == this.auth.userId) return;
    this.userService.addFriend(id).then(() => {
      this.updateFriendsList();
    })
    .catch((error) => { console.log(error) });
  }

  onRemove(id: string) {
    this.userService.removeFriend(id).then(() => {
      this.updateFriendsList();
    })
    .catch((error) => { console.log(error) });
  }

  updateFriendsList() {
    this.userService.getFriendsByEmail(this.auth.userEmail).then(friends => {
      var friendsNb: number = (<any>friends).friends.length;
      if(friendsNb) this.friendsLoading = true;
      this.friends = [];
      (<any>friends).friends.forEach((id, i) => {
        this.userService.getUserById(id).then(friend => {
          this.friends.push(friend);
          if (i == friendsNb -1) this.friendsLoading = false;
        })
        .catch((error) => { console.log(error) });
      });
    })
    .catch((error) => { console.log(error) });
  }

  searchUser() {
      var value = $("#search").val().toLowerCase();
      $(".userRow span").filter(function() {
        $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
  }
}

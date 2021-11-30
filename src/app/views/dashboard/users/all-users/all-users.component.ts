import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user.model';
import { UserService } from 'src/services';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {
  users: User[];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getAllUsersStync().subscribe(data => {
      if (data) {
        this.users = data;
      }
    })
  }
  view(w) { }
  back() { }
}

import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/users.service';
import { UsersDetails } from '../../interfaces/usersModel';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  public users: UsersDetails[] = [];
  public loadingSpinner: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadingSpinner = true;
    this.userService.users$.subscribe((users: UsersDetails[]) => {
      this.users = users;
      this.loadingSpinner = false;
    });

    this.userService.getUsers();
  }
}

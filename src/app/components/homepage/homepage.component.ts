import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/users.service';
import { UsersDetails } from '../../interfaces/usersModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UserDetailsModalComponent } from '../user-details-modal/user-details-modal.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  users: UsersDetails[] = [];
  displayedColumns: string[] = ['name', 'email', 'address'];
  dataSource!: MatTableDataSource<UsersDetails>;
  @ViewChild(MatSort) sort!: MatSort;
  public loadingSpinner: boolean = true;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingSpinner = true;
    this.userService.users$.subscribe((users: UsersDetails[]) => {
      this.users = users;
      this.updateDataSource();
      this.loadingSpinner = false;
    });

    this.userService.getUsers();
  }

  openUserDetailsModal(user: UsersDetails): void {
    const dialogRef = this.dialog.open(UserDetailsModalComponent, {
      width: '400px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result: UsersDetails) => {
      if (result) {
        this.userService.updateUser(result).subscribe((updatedUser) => {
          const index = this.users.findIndex((u) => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            this.updateDataSource();
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  private updateDataSource(): void {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
  }
}

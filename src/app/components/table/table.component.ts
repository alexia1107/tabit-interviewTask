import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UsersDetails } from '../../interfaces/usersModel';
import { UserDetailsModalComponent } from '../user-details-modal/user-details-modal.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() users: UsersDetails[] = [];
  public displayedColumns: string[] = ['name', 'email', 'address'];
  public dataSource!: MatTableDataSource<UsersDetails>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateDataSource();
  }

  ngOnChanges(): void {
    this.updateDataSource();
  }

  openUserDetailsModal(user: UsersDetails): void {
    const dialogRef = this.dialog.open(UserDetailsModalComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result: UsersDetails) => {
      if (result) {
        const index = this.users.findIndex((userID) => userID.id === result.id);
        if (index !== -1) {
          this.users[index] = result;
          this.updateDataSource();
          this.cdr.detectChanges();
        }
      }
    });
  }

  private updateDataSource(): void {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
  }
}

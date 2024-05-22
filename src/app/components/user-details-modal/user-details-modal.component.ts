import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { UsersDetails } from '../../interfaces/usersModel';

@Component({
  selector: 'app-user-details-modal',
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.css'],
})
export class UserDetailsModalComponent implements OnInit {
  userData: UsersDetails = {} as UsersDetails;
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<UserDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsersDetails,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      address: ['', [Validators.pattern(/^[A-Za-z0-9\s,'"]*$/)]],
    });
  }
  ngOnInit(): void {
    this.userData = { ...this.data };

    this.userForm.patchValue({
      name: this.userData.name,
      email: this.userData.email,
      address: this.userData.address.street,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      const userDataToUpdate = {
        ...this.data,
        ...this.userForm.value,
      };

      this.userService.updateUser(userDataToUpdate).subscribe(
        (updatedUser) => {
          this.dialogRef.close(updatedUser);
        },
        (error) => {
          console.error('Error updating user data:', error);
        }
      );
    }
  }
}

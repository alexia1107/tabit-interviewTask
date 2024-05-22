import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { UsersDetails } from '../../interfaces/usersModel';
import { catchError } from 'rxjs';

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
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\s*[A-Za-z]+(?:\s+[A-Za-z]+)*\s*$/),
        ],
      ],
      email: { value: '', disabled: true },
      city: [''],
      zipcode: [''],
      street: [''],
      suite: [''],
    });
  }

  ngOnInit(): void {
    this.userData = { ...this.data };

    this.userForm.patchValue({
      name: this.userData.name,
      email: this.userData.email,
      city: this.userData.address.city,
      zipcode: this.userData.address.zipcode,
      street: this.userData.address.street,
      suite: this.userData.address.suite,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      const userDataToUpdate = {
        ...this.data,
        name: this.userForm.get('name')?.value,
        email: this.userForm.get('email')?.value,
        address: {
          ...this.data.address,
          city: this.userForm.get('city')?.value,
          zipcode: this.userForm.get('zipcode')?.value,
          street: this.userForm.get('street')?.value,
          suite: this.userForm.get('suite')?.value,
        },
      };

      this.userService
        .updateUser(userDataToUpdate)
        .pipe(
          catchError((error) => {
            console.error('Error updating user data:', error);
            throw error;
          })
        )
        .subscribe((updatedUser) => {
          this.dialogRef.close(updatedUser);
        });
    }
  }
}

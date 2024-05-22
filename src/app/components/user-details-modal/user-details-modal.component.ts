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
  public userForm!: FormGroup;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<UserDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsersDetails,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: [this.data.name, [Validators.required, Validators.pattern(/^\s*[A-Za-z]+(?:\s+[A-Za-z]+)*\s*$/)]],
      email: { value: this.data.email, disabled: true },
      city: [this.data.address.city],
      zipcode: [this.data.address.zipcode],
      street: [this.data.address.street],
      suite: [this.data.address.suite],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      const userDataToUpdate = {
        ...this.data,
        name: this.userForm.controls['name'].value,
        email: this.userForm.controls['email'].value,
        address: {
          ...this.data.address,
          city: this.userForm.controls['city'].value,
          zipcode: this.userForm.controls['zipcode'].value,
          street: this.userForm.controls['street'].value,
          suite: this.userForm.controls['suite'].value,
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

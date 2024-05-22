import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserDetailsModalComponent } from './user-details-modal.component';
import { UserService } from '../../services/users.service';
import { UsersDetails } from '../../interfaces/usersModel';

describe('UserDetailsModalComponent', () => {
  let component: UserDetailsModalComponent;
  let fixture: ComponentFixture<UserDetailsModalComponent>;
  let mockDialogRef: MatDialogRef<UserDetailsModalComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  const mockData: UsersDetails = {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    address: {
      street: '123 Street',
      suite: 'Suite 101',
      city: 'City',
      zipcode: '12345',
      geo: {
        lat: '40.7128',
        lng: '-74.0060'
      }
    },
    phone: '123-456-7890',
    website: 'example.com',
    company: {
      name: 'Example Company',
      catchPhrase: 'Catchy phrase',
      bs: 'Business stuff'
    }
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockUserService = jasmine.createSpyObj('UserService', ['updateUser']);

    await TestBed.configureTestingModule({
      declarations: [UserDetailsModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }, 
        { provide: UserService, useValue: mockUserService },
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with data', () => {
    component.ngOnInit();
    expect(component.userForm.value).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      city: 'City',
      zipcode: '12345',
      street: '123 Street', 
      suite: 'Suite 101' 
    });
  });

});

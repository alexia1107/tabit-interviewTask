import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';

import { of } from 'rxjs';
import { TableComponent } from './table.component';
import { UsersDetails } from '../../interfaces/usersModel';
import { UserDetailsModalComponent } from '../user-details-modal/user-details-modal.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open user details modal', () => {
    const user: UsersDetails = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        city: 'City',
        zipcode: '12345',
        street: 'Street',
        suite: 'Suite',
      },
    };

    mockDialog.open.and.returnValue({ afterClosed: () => of(user) } as any);

    component.openUserDetailsModal(user);
    expect(mockDialog.open).toHaveBeenCalledWith(UserDetailsModalComponent, {
      width: '500px',
      data: user,
    });

    expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
  });
});

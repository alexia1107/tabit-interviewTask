import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, tap } from 'rxjs';
import { UsersDetails } from '../interfaces/usersModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/users';
  private usersSubject: BehaviorSubject<UsersDetails[]> = new BehaviorSubject<
    UsersDetails[]
  >([]);
  public users$: Observable<UsersDetails[]> = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}
  getUsers(): void {
    this.http.get<UsersDetails[]>(this.baseUrl).subscribe(
      (users) => {
        this.usersSubject.next(users);
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  updateUser(updatedUser: UsersDetails): Observable<UsersDetails> {
    return this.http
      .put<UsersDetails>(`${this.baseUrl}/${updatedUser.id}`, updatedUser)
      .pipe(
        catchError((error) => {
          console.error('Error updating user:', error);
          throw error;
        })
      );
  }
}

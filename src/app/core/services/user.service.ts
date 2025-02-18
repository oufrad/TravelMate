import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../dtos/userDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7123/api'; //TODO: later on put it on the envirenments files. 

  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(error => {
        console.error('Error details:', error);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );;
  }

  addUser(user: UserDto) {
    return this.httpClient.post<User>(`${this.apiUrl}/users`, {
      "name": user.name,
      "userName": "",
      "email": user.email,
      "rating": 0,
      "role": user.role.value
    }).pipe(
      catchError(error => {
        console.error('Error adding user:', error);
        return throwError(() => new Error('Failed to add user'));
      })
    );
  }

  updateUser(updatedUser: UserDto) {
    return this.httpClient.put<User>(`${this.apiUrl}/users`, {
      "id": updatedUser.id,
      "name": updatedUser.name,
      "email": updatedUser.email,
      "role": updatedUser.role.value,
      "status": updatedUser.status.value
    }).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => new Error('Failed to update user'));
      })
    );
  }

  deleteUser(id: number) {
   return this.httpClient.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
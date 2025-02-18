import { Component, inject, signal } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { CommonModule, NgFor } from '@angular/common';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserDetailComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  host: {
    ngSkipHydration: 'true'  // Add this line
  }
})
export class UserListComponent {
  users = signal<User[]>([])
  isAddingNew = signal(false);
  emptyUser: User = {
    id: 0,
    name: '',
    email: '',
    role: { value: 0, name: 'Regular' },
    status: { value: 0, name: 'Active' },
    bio: '' 
  }

  constructor(public userService: UserService) {}

  ngOnInit(): void{
    this.loadUsers()
    console.log(this.users())
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe((results)=>{
      this.users.set(results)
    });
  }

  addNewRow(){
    this.isAddingNew.set(true);
  }

  cancelAdd(){
    this.isAddingNew.set(false);
  }

  onUserAdded(newUser: User){
    this.users.update(users => [...users, newUser]);
    this.isAddingNew.set(false);
  }

  onUserUpdated(updatedUser: User){
    const currentUsers = this.users();
    const updatedUsers = currentUsers.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    this.users.set(updatedUsers);
  }

  onUserDeleted(userId: number){
    const currentUsers = this.users();
    const updatedUsers = currentUsers.filter(user => user.id !== userId);
    this.users.set(updatedUsers);
  }

}

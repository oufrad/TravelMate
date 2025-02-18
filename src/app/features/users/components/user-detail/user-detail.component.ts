import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { UserDto } from '../../../../core/dtos/userDto';
import { RoleOptions, statusOptions } from '../../../../core/models/config.model';

@Component({
  selector: 'tr[app-user-detail]',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {
  statusOptions = statusOptions;
  roleOptions = RoleOptions;

  isEditing = signal<boolean>(false)
  private user$ = signal<User | null>(null);
  userForm!: FormGroup;

  @Output() userUpdated = new EventEmitter<User>();
  @Output() userAdded = new EventEmitter<User>();
  @Output() cancelAdd = new EventEmitter<void>();
  @Output() userDeleted = new EventEmitter<number>();

  @Input() isNew = false;
  @Input() set user(value: User) {
    this.user$.set(value);
    if(value){
      this.userForm.patchValue({
        name: value.name,
        email: value.email,
        role: value.role.value,
        status: value.status.value
      })
    }
  }

  constructor(private fb: FormBuilder, private userService: UserService){
    this.initForm();
  }

  private initForm(){
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [{}, Validators.required],
      status: ['', Validators.required]
    })
  }

  get userValue(){
    return this.user$();
  }

  getStatusClass(): string {
    const baseClasses = 'rounded-full px-3 py-1 text-xs font-semibold';
    switch (this.userValue?.status.name) {
      case 'Active':
        return `${baseClasses} bg-green-200 text-green-900`;
      case 'Suspended':
        return `${baseClasses} bg-yellow-200 text-yellow-900`;
      case 'Inactive':
        return `${baseClasses} bg-red-200 text-red-900`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-900`;
    }
  }

  onDeleteUser(): void {
    if (this.userValue) {
      this.userService.deleteUser(this.userValue.id ?? 0).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.userDeleted.emit(this.userValue?.id);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  onCancelEditing(){
    if (this.isNew) {
      this.cancelAdd.emit();
    } else {
      this.isEditing.set(false);
    }
  }

  shouldShowForm(): boolean {
    return this.isNew || this.isEditing();
  }

  onSubmitForm() {
    if (this.userForm.valid) {
      if(this.isNew){
        const newUser: UserDto = {
          email: this.userForm.get('email')?.value,
          name: this.userForm.get('name')?.value,
          role: {
            name: '',
            value: +this.userForm.get('role')?.value
          },
          status: {
            name: '',
            value: +this.userForm.get('status')?.value
          }
        }
        console.log(newUser)
        this.addUser(newUser)
      }else{
        const updatedUser: UserDto = {
          id: this.userValue?.id,
          email: this.userForm.get('email')?.value,
          name: this.userForm.get('name')?.value,
          role: {
            name: '',
            value: +this.userForm.get('role')?.value
          },
          status: {
            name: '',
            value: +this.userForm.get('status')?.value
          }
        }
        console.log(this.userForm.get('role')?.value)
        console.log(updatedUser)
        this.updateUser(updatedUser)
      }
    }
  }

  updateUser(updatedUser: UserDto){
    this.userService.updateUser(updatedUser).subscribe({
      next: (response) => {
        console.log('User updated successfully', response);
        this.isEditing.set(false);
        this.user$.set(response)
        this.userUpdated.emit(response)
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }

  addUser(addedUser: User){
    console.log(addedUser)
    this.userService.addUser(addedUser).subscribe({
      next: (response) => {
        console.log('User added successfully', response);
        this.userAdded.emit(response);
      },
      error: (error) => {
        console.error('Error adding user:', error);
      }
    });
  }
  

  onChangeToEdit(): void {
    if (this.userValue) {
      const roleValue = this.userValue.role?.value;
      const statusValue = this.userValue.status?.value;
      
      console.log('Current values:', { 
          role: roleValue, 
          status: statusValue 
      });

      this.userForm.patchValue({
          name: this.userValue.name,
          email: this.userValue.email,
          role: roleValue,
          status: statusValue
      });
    }
    this.isEditing.set(true);
  }


}

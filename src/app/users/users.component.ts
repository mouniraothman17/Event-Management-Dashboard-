import { Component, OnInit } from '@angular/core';
import { AttendeesService } from '../attendees.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  currentDate: Date = new Date();
  attendees: any[] = [];
  searchControl = new FormControl('');

  constructor(private usersService: AttendeesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => {
        if (!query) {
          this.loadUsers();
          return [];
        }
        return this.usersService.searchUsers(query);
      })
    ).subscribe({
      next: (res: any) => {
        if (res && res.users) {
          this.attendees = res.users.map((u: any) => ({
            name: u.name,
            phone: u.phoneNumber,
            email: u.email,
            isVerified: u.isVerified
          }));
        }
      },
      error: (err) => console.error('Error searching users:', err)
    });
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (res) => {
        this.attendees = res.users.map((u: any) => ({
          name: u.name,
          phone: u.phoneNumber,
          email: u.email,
          isVerified: u.isVerified
        }));
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  deleteAttendee(index: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: { name: this.attendees[index].name } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attendees.splice(index, 1);
      }
    });
  }
}

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-logout-dialog',
  templateUrl: './confirm-logout-dialog.component.html',
})
export class ConfirmLogoutDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmLogoutDialogComponent>) {}

  onConfirm(): void {
    localStorage.removeItem('token');

    window.location.href = 'https://graduate-kgh0.onrender.com';
  }

  onCancel(): void {
    this.dialogRef.close(false); 
  }
}

import { Component, inject } from '@angular/core';
import { UiConfirmDialogData } from '../../../core/models/ui-confirm-dialog-data';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ui-confirm-dialog',
  imports: [
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './ui-confirm-dialog.component.html',
  styleUrl: './ui-confirm-dialog.component.css'
})
export class UiConfirmDialogComponent {
  readonly data = inject<UiConfirmDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<UiConfirmDialogComponent>);

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}

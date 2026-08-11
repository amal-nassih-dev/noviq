import { Component, computed, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectResponse } from '../../../core/models/project/project-response';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UiInputComponent } from '../../../shared/component/ui-input/ui-input.component';
import { UiButtonComponent } from '../../../shared/component/ui-button/ui-button/ui-button.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-dialog',
  imports: [
    MatDialogModule,
    UiInputComponent,
    UiButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.css'
})
export class ProjectDialogComponent {
   protected readonly fb = inject(FormBuilder);
   readonly dialogRef =
      inject(MatDialogRef<ProjectDialogComponent>);

  readonly data =
      inject<ProjectResponse| null>(MAT_DIALOG_DATA); 

  readonly isEditMode = computed(() => !!this.data);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description : ['', []]
  })

  constructor(){
      if(this.data){
          this.form.patchValue({
              name: this.data.name,
              description: this.data.description
          });
      }
  }

  close(): void{
    this.dialogRef.close();
  }

  save(): void{
     if(this.form.invalid){
          this.form.markAllAsTouched();
          return;
      }

      this.dialogRef.close(this.form.getRawValue());
  }
}

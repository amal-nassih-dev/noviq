import { Component, Input, computed, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UiInputComponent } from '../../../shared/component/ui-input/ui-input.component';
import { UiButtonComponent } from '../../../shared/component/ui-button/ui-button/ui-button.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { OrganizationService } from '../../../core/services/organization.service';
import { OrganizationResponse } from '../../../core/models/organization/organization-response';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-organization-dialog',
  imports: [
    MatDialogModule,
    UiInputComponent,
    UiButtonComponent,
    ReactiveFormsModule
],
  templateUrl: './organization-dialog.component.html',
  styleUrl: './organization-dialog.component.css'
})
export class OrganizationDialogComponent {

  protected readonly fb = inject(FormBuilder);
   readonly dialogRef =
      inject(MatDialogRef<OrganizationDialogComponent>);

  readonly data =
      inject<OrganizationResponse| null>(MAT_DIALOG_DATA); // this is how we recieve the data from the caller of this component

  readonly isEditMode = computed(() => !!this.data); // if it has already data initalized then that is an edit else this is a create

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description : ['', []]
  })

  constructor(){
      // prefeeling the data in case of edit 
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

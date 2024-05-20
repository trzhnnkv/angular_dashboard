import { NgModule } from '@angular/core';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

const MaterialComponents = [
  MatSnackBarModule,
  MatProgressSpinnerModule,
]

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
})
export class MaterialModule { }

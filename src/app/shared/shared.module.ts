import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "./material/material.module";
import { FilterUsersPipe } from "./pipes/filter-users.pipe";
import { SortUsersPipe } from "./pipes/sort-users.pipe";

@NgModule({
  declarations: [
    FilterUsersPipe,
    SortUsersPipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FilterUsersPipe,
    SortUsersPipe
  ]
})
export class SharedModule { }

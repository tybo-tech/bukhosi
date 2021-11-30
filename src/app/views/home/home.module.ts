import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule, declarations } from './home-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { MaterialModule } from 'src/app/material';
// import { PrimeNgModule } from 'src/app/primeng';
// import { QuillModule } from 'ngx-quill';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import {ClipboardModule} from '@angular/cdk/clipboard';

@NgModule({
  imports: [
    GooglePlaceModule,
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    ClipboardModule,


    // QuillModule.forRoot()

  ],
  declarations: [...declarations]
})
export class HomeModule { }



import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; //CommonModule is for ngIf and so on...
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
        FormsModule, 
        CommonModule,
        MaterialModule,
        FlexLayoutModule
    ],
    exports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        FlexLayoutModule
    ]
})
export class SharedModule {

}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordDescriptorComponent } from '../components/password-descriptor/password-descriptor.component';

@NgModule({
  declarations: [PasswordDescriptorComponent],
  imports: [
    CommonModule
  ],
  exports:[
    PasswordDescriptorComponent
  ]
})
export class SharedModule { }

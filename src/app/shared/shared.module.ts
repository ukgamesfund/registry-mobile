import { NgModule } from '@angular/core';
import {GoogleplaceDirective} from "../../directives/googleplace/googleplace";



@NgModule({
  providers: [],
  exports: [
    GoogleplaceDirective
  ],
  declarations: [
    GoogleplaceDirective
  ]
})
export class SharedModule {}

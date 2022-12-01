import { NgModule } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'other-component',
  template: '<span>TESTING</span>'
})
export class OtherComponent  {
}

@NgModule({
  declarations: [OtherComponent],
  exports: [OtherComponent]
})
export class OtherComponentModule {
}
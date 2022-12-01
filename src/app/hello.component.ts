import { NgModule } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { OtherComponentModule } from './other.component';
import { OtherComponent } from './other.component';
import { MyService } from './my.service';
import { QuotingPipe } from './quoting.pipe';

@Component({
  selector: 'hello',
  template: `<h1>Hello {{name | quoting}}{{punctuation}}</h1><other-component></other-component>`,
  styles: [`h1 { font-family: Lato; }`]
  ,providers: [ MyService ] //wouldn't need to define here if marked includedIn: 'root'
})
export class HelloComponent implements OnInit {
  @Input() name: string;
  punctuation: string;

  constructor(private myService: MyService) {}

  ngOnInit(): void {
    this.punctuation = this.myService.getPunctuation();
  }
}

@NgModule({
  imports: [ OtherComponentModule ],
  declarations: [ HelloComponent, QuotingPipe ],
  exports: [ HelloComponent ]
})
export class HelloComponentModule {}

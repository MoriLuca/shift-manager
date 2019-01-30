import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.css']
})
export class SignaturePadComponent implements OnInit {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  
  title = 'ng';

  screenHeight = window.innerHeight;
  screenWidth = window.innerWidth;

  private signaturePadOptions: Object ;

  constructor() {
    this.signaturePadOptions = { // passed through to szimek/signature_pad constructor
      'minWidth': 5,
      'canvasWidth': 500,//this.screenWidth-5,
      'canvasHeight': 200//this.screenHeight-50
    };
    console.log(this.signaturePadOptions);
     
  }

  ngOnInit(){}
  
 
  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
 
  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL());
  }
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  save(){
    var image = this.signaturePad.toDataURL("image/png").replace("image/png", "application/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    window.location.href=image;
  }

  read(){
    console.log({ "firma": this.signaturePad.toDataURL("image/png").replace("image/png", "application/octet-stream")});
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { GlobalRuntimeConfigService } from 'src/app/services/globalRuntimeConfig/global-runtime-config.service';
import { ApiService } from 'src/app/services/api/api.service';

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
  test: any;
  private signaturePadOptions: Object ;

  rtmSvc: GlobalRuntimeConfigService;
  api: ApiService;

  constructor(_globalRuntimeService :GlobalRuntimeConfigService,
              _api: ApiService) {
    this.rtmSvc = _globalRuntimeService;
    this.api = _api;
  }

  ngOnInit(){
    this.signaturePadOptions = { // passed through to szimek/signature_pad constructor
      'minWidth': 5,
      'canvasWidth': 600,//this.screenWidth-5,
      'canvasHeight': 200//this.screenHeight-50
    };
    console.log(this.signaturePadOptions);
  }
  
 
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
    let image = this.signaturePad.toDataURL("image/png").replace("image/png", "application/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    //window.location.href=image;
    let body = {"firma":image, "scontrino":this.test};
    this.api.salvaRapportino(body).subscribe((res)=>{console.log(res);});;
  }

  read(){
    console.log({ "firma": this.signaturePad.toDataURL("image/png").replace("image/png", "application/octet-stream" )});
  }

  readIMG(){
    console.log(this.test);
    
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        // this.form.get('avatar').setValue({
        //   filename: file.name,
        //   filetype: file.type,
        //   value: reader.result.split(',')[1]
        // })
        this.test = reader.result;
        console.log(this.test);
        
      };
    }
  }
}

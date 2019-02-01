import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';

//services
import { GlobalRuntimeConfigService } from "./services/globalRuntimeConfig/global-runtime-config.service";
import { ApiService } from "./services/api/api.service";

//components
import { AppComponent } from './app.component';
import { TopMenuComponent } from './componenets/top-menu/top-menu.component';
import { HomeComponent } from './componenets/home/home.component';
import { NotFoundComponentComponent } from './componenets/not-found-component/not-found-component.component';


//signature pad
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignaturePadComponent } from './componenets/signature-pad/signature-pad.component';
import { NuovoResocontoLavoroComponent } from './componenets/nuovo-resoconto-lavoro/nuovo-resoconto-lavoro.component';




@NgModule({
  declarations: [
    AppComponent,

    TopMenuComponent,
    HomeComponent,
    NotFoundComponentComponent,
    SignaturePadComponent,
    NuovoResocontoLavoroComponent,
  ],
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    FormsModule,
    HttpClientModule,
    SignaturePadModule,
    RouterModule.forRoot([
      {path:"",component: HomeComponent},
      {path:"pad",component: SignaturePadComponent},
      //esempi
      // {path:"laghi",component: LaghiComponent},
      // {path:"lago/:id",component: LagoComponent},
      {path:"**",component: NotFoundComponentComponent}
    ])
  ],
  providers: [
    GlobalRuntimeConfigService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

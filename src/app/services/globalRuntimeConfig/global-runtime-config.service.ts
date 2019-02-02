import { Injectable, OnInit } from '@angular/core';
import { config } from 'rxjs';
import { GlobalRuntimeConfig } from '../../models/globalRuntimeConfig/globalConfig';
import { User } from 'src/app/models/users/user';

@Injectable({
  providedIn: 'root'
})
export class GlobalRuntimeConfigService implements OnInit {

  private config = new GlobalRuntimeConfig();

  constructor() {}

  getConfig(): GlobalRuntimeConfig{
    return this.config;
  }

  getUser(): User{
    return this.config.user;
  }

  ngOnInit(){
    // funzione login da implementare
    // this.config.user = {id: 1, nome: "Luca", cognome: "Mori", role: 2};
  }
}



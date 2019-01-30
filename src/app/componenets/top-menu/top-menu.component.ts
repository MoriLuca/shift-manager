import { Component, OnInit } from '@angular/core';
import { GlobalRuntimeConfigService } from '../../services/globalRuntimeConfig/global-runtime-config.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {

  txt = new Testi();
  rtmSvc : GlobalRuntimeConfigService;

  constructor(_globalRuntimeService :GlobalRuntimeConfigService) {
    this.rtmSvc = _globalRuntimeService;
  }

  ngOnInit() {
  }

}

class Testi {
  monitor = ["Live Monitor",""];
  recipes = ["Ricette","Recipes"];
  production = ["Produzione","Production"];
}
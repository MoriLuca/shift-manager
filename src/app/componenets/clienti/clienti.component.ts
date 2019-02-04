import { Component, OnInit } from '@angular/core';
import { GlobalRuntimeConfigService } from 'src/app/services/globalRuntimeConfig/global-runtime-config.service';
import { ApiService } from 'src/app/services/api/api.service';
import { Cliente } from 'src/app/models/clienti/cliente';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-clienti',
  templateUrl: './clienti.component.html',
  styleUrls: ['./clienti.component.css']
})
export class ClientiComponent implements OnInit {

  private _clienti: Cliente[];
  private _clienteSelezionato: Cliente = new Cliente();
  private _ricercaCliente: string ="";


  constructor(private _globalRuntimeService: GlobalRuntimeConfigService,
              private _api: ApiService) { }

  ngOnInit() {
    this._api.getElelncoClienti().subscribe((res)=>{
      this._clienti = res;
      console.log(res);
      
    });
  }

  selectCliente(c: Cliente){
    this._clienteSelezionato = c;
  }

}

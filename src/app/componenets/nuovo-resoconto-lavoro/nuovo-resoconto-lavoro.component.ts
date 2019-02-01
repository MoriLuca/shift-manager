import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/clienti/cliente';
import { ApiService } from 'src/app/services/api/api.service';
import { CommessaBasic } from 'src/app/models/commesse/commessaBasic';
import { ResocontoLavoro } from 'src/app/models/resoconto-lavoro/resoconto-lavoro';

@Component({
  selector: 'app-nuovo-resoconto-lavoro',
  templateUrl: './nuovo-resoconto-lavoro.component.html',
  styleUrls: ['./nuovo-resoconto-lavoro.component.css']
})
export class NuovoResocontoLavoroComponent implements OnInit {

  private _utenteId = 1;
  private _ricercaCliente: string ="";
  private _ricercaCommessa: string ="";
  private _resocontoLavoro: ResocontoLavoro;

  private _scelteTipoLavoro = [{"nome":"Installazione", "value":1}, {"nome":"Sviluppo in Ufficio", "value":2}, {"nome":"Riunione/Specifiche", "value":3}];

  private _clienti: Cliente[];
  private _commesse: CommessaBasic[];
  constructor(private _api: ApiService) {
    this._api = _api;
  }

  private _clienteSelezionato: Cliente;
  private _commessaSelezionata: CommessaBasic;

  ngOnInit() {
    this._resocontoLavoro = new ResocontoLavoro();
    this._resocontoLavoro.utenteId = this._utenteId; // da prendere da runtime config
    this._api.getElelncoClienti().subscribe((res)=>{
      this._clienti = res;
    });
  }

  getCommesseFromClientId(cliente: Cliente){
    this._commessaSelezionata = null;
    this._api.getCommesseBasicFromClientId(cliente.clienteId).subscribe((res)=>{
      this._commesse = res;
      this._clienteSelezionato = cliente;
      console.log(res);
    });
  }

  setCommessaSelezionata(commessa: CommessaBasic){
    this._resocontoLavoro.commessaId = commessa.commessaId;
    this._commessaSelezionata = commessa;
    console.log(this._resocontoLavoro.commessaId );
  }


  salvaResocontoLavoro(){
    if(this._resocontoLavoro.tipologialavoro == 2) {
      if (this._resocontoLavoro.spese > 0 || this._resocontoLavoro.km > 0){
        alert("Il valore di spese e chilmetri verrà impstato a 0.\nNon si possono aggiungere spese e chiloetri se il tipo di lavoro è [ Sviluppo in Ufficio ].");
        this._resocontoLavoro.spese = 0;
        this._resocontoLavoro.km = 0;   
      }
    }
    console.log(this._resocontoLavoro);
    this._api.postSalvataggioResocontoLavoro(this._resocontoLavoro).subscribe((res)=>{
      console.log(res);
      
    });
  }
}

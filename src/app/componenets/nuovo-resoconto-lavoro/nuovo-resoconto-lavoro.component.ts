import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/clienti/cliente';
import { ApiService } from 'src/app/services/api/api.service';
import { CommessaBasic } from 'src/app/models/commesse/commessaBasic';
import { ResocontoLavoro } from 'src/app/models/resoconto-lavoro/resoconto-lavoro';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

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
  p: FormGroup;

  private _scelteTipoLavoro = [{"nome":"Installazione", "value":1}, {"nome":"Sviluppo in Ufficio", "value":2}, {"nome":"Riunione/Specifiche", "value":3}];

  private _clienti: Cliente[];
  private _commesse: CommessaBasic[];
  constructor(private _api: ApiService, private _fb: FormBuilder) {
  }


generateScontrino(){
  return this._fb.group({
    body: [''],
  })
}

aggiungiNuovoScontrino(){
  (this.p.controls['scontrini'] as FormArray).push(this.generateScontrino())
  
}

///////////////////


  private _clienteSelezionato: Cliente;
  private _commessaSelezionata: CommessaBasic;

  ngOnInit() {
    this._resocontoLavoro = new ResocontoLavoro();
    this._resocontoLavoro.utenteId = this._utenteId; // da prendere da runtime config
    this._api.getElelncoClienti().subscribe((res)=>{
      this._clienti = res;
    });


    this.p = this._fb.group({
      utenteId: [1 ,Validators.min(1)],//<--- leggere l'id utente dalla runtime config
      commessaId: [-1, Validators.min(1)],
      dataintervento: [new FormControl(new Date().toISOString().substring(0,10))],
      totalelavoro: [0, Validators.min(0)],
      totaleviaggio: [0, Validators.min(0)],
      spese: [0, Validators.min(0)],
      km: [0, [Validators.min(0),Validators.max(3)]],
      info: [''],
      tipologialavoro: [1, [Validators.min(1),Validators.max(3)]],
      scontrini: this._fb.array([this.generateScontrino()])
    });
  }

  getCommesseFromClientId(cliente: Cliente){
    this.p.controls["commessaId"].setValue(-1);
    this._api.getCommesseBasicFromClientId(cliente.clienteId).subscribe((res)=>{
      this._commesse = res;
      this._clienteSelezionato = cliente;
      console.log(res);
    });
  }

  setCommessaSelezionata(commessa: CommessaBasic){
    this._resocontoLavoro.commessaId = commessa.commessaId;
    this._commessaSelezionata = commessa;
    this.p.controls["commessaId"].setValue(4000);
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

  onSubmit(){
    console.warn(this.p.value);
  }
}

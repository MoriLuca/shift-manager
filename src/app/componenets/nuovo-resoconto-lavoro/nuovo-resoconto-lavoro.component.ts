import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/clienti/cliente';
import { ApiService } from 'src/app/services/api/api.service';
import { CommessaBasic } from 'src/app/models/commesse/commessaBasic';
import { ResocontoLavoro } from 'src/app/models/resoconto-lavoro/resoconto-lavoro';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { GlobalRuntimeConfigService } from 'src/app/services/globalRuntimeConfig/global-runtime-config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-nuovo-resoconto-lavoro',
  templateUrl: './nuovo-resoconto-lavoro.component.html',
  styleUrls: ['./nuovo-resoconto-lavoro.component.css']
})
export class NuovoResocontoLavoroComponent implements OnInit {

  private _utenteId = 1;
  private _ricercaCliente: string ="";
  private _ricercaCommessa: string ="";

  form: FormGroup;

  private _scelteTipoLavoro = [{"nome":"Installazione", "value":1}, {"nome":"Sviluppo in Ufficio", "value":2}, {"nome":"Riunione/Specifiche", "value":3}];

  private _clienti: Cliente[];
  private _commesse: CommessaBasic[];
  constructor(private _api: ApiService,
              private _fb: FormBuilder,
              private _rntSrv: GlobalRuntimeConfigService,
              public sanitizer: DomSanitizer) {
  }



///////////////////


  private _clienteSelezionato: Cliente;
  private _commessaSelezionata: CommessaBasic;

  ngOnInit() {
    //alla creazione del modulo, richiedo la lista clienti
    this._api.getElelncoClienti().subscribe((res)=>{
      this._clienti = res;
    });


    //creo la reactive form per la gestione del nuovo resoconto di lavoro
    this.form = this._fb.group({
      utenteId: [this._rntSrv.getUser().id ,Validators.min(1)],
      commessaId: [1, Validators.min(1)],
      dataintervento: [new Date().toISOString().substring(0,10)],
      totalelavoro: [0, [Validators.min(0), Validators.max(24)]],
      totaleviaggio: [0, [Validators.min(0), Validators.max(24)]],
      spese: [0, Validators.min(0)],
      km: [0, [Validators.min(0),Validators.max(3)]],
      info: [''],
      tipologialavoro: [3, [Validators.min(1),Validators.max(3)]],
      scontrini: this._fb.array([])
    });
  }

  //richiesta dell'elenco commesse in base al cliente selezionato
  getCommesseFromClientId(cliente: Cliente){
    this.form.controls["commessaId"].setValue(-1);
    this._api.getCommesseBasicFromClientId(cliente.clienteId).subscribe((res)=>{
      this._commesse = res;
      this._clienteSelezionato = cliente;
      console.log(res);
    });
  }

  setCommessaSelezionata(commessa: CommessaBasic){
    this.form.controls["commessaId"].setValue(commessa.commessaId);
  }

  onSubmit(){

    console.warn(this.form.value);
    if(this.form.controls["tipologialavoro"].value == 2) {
      if (this.form.controls["spese"].value> 0 || this.form.controls["km"].value > 0){
        alert("Il valore di spese e chilometri verrà impstato a 0.\nNon si possono aggiungere spese e chiloetri se il tipo di lavoro è diverso da [ Installazione ].");
        this.form.controls["spese"].setValue(0);
        this.form.controls["km"].setValue(0);
      }
    }
    let r: ResocontoLavoro = <ResocontoLavoro> this.form.value;
    this._api.postSalvataggioResocontoLavoro(r).subscribe((res)=>{
      console.log(res);
      
    });
  }



  onFileChange(event, index){
    
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
        
        console.log((this.form.controls["scontrini"] as FormArray).controls[index].value.body);
        var img = reader.result;
        (this.form.controls["scontrini"] as FormArray).controls[index].value.body = img;
        
        // (this.form.value.scontrini as FormArray)[index]['body'] = reader.result;
      };
    }
    else{
      console.log("elimino la riga seleizionata per non lasciarla vuota");
      (this.form.controls["scontrini"] as FormArray).removeAt(index);
    }
  }

  //generazione campo scontrino per la form group
  generateScontrino(){
    return this._fb.group({
      body: ""
    })
  }

  //aggiunta di un nuovo scontrino nella form
  aggiungiNuovoScontrino(){
    //controllo se l'ultimo scontrino presente è pieno
    let numeroScontrini = (this.form.controls["scontrini"] as FormArray).length;
    
    
    if (numeroScontrini > 0){
      console.log((this.form.controls["scontrini"] as FormArray).controls[numeroScontrini-1].value.body);
      if ((this.form.controls["scontrini"] as FormArray).controls[numeroScontrini-1].value.body === ""){
        alert("Prima di inserire un nuovo scontrino, utilizza quelli caricati.");
        return;
      } 
    }
    (this.form.controls["scontrini"] as FormArray).push(this.generateScontrino()); 
    
  }

  dbg(){
    console.log((this.form.controls["scontrini"] as FormArray).controls[0].value.body);
  }

  //rimozione scontrino dalla form in base all'index passato alla funzione
  rimuoviScontrino(index: number){
    (this.form.controls["scontrini"] as FormArray).removeAt(index);
  }
  
}



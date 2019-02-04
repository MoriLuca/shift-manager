import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  private _titoloResocontoLavoro: string ="";
  private _showUpdatingCover: boolean = false;

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


  private _clienteSelezionato: Cliente = new Cliente();
  private _commessaSelezionata: CommessaBasic;

  private _storiaResoconti: any;

  ngOnInit() {
    //alla creazione del modulo, richiedo la lista clienti
    this.resetTitoloResoconto();
    this._api.getElelncoClienti().subscribe((res)=>{
      this._clienti = res;
    });


    //creo la reactive form per la gestione del nuovo resoconto di lavoro
    this.form = this._fb.group({
      utenteId: [this._rntSrv.getUser().id ,Validators.min(1)],
      commessaId: [-1, Validators.min(1)],
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


  private resetTitoloResoconto(){
    this._titoloResocontoLavoro = "Attesa selezione cliente e commessa";
  }

  //richiesta dell'elenco commesse in base al cliente selezionato
  getCommesseFromClientId(cliente: Cliente){
    this._storiaResoconti = null;
    this.resetTitoloResoconto();
    this.form.controls["commessaId"].setValue(-1);
    this._api.getCommesseBasicFromClientId(cliente.clienteId).subscribe((res)=>{
      this._commesse = res;
      this._clienteSelezionato = cliente;
    });
  }

  private loadResocontiHistory(commessaId){
    this._storiaResoconti = null;
    this._api.getResocontiFromUtenteCommessa(this._rntSrv.getConfig().user.id,commessaId).subscribe((res)=>{
      this._storiaResoconti = res;
      console.log(this._storiaResoconti);
      
      
    });
  }

  setCommessaSelezionata(commessa: CommessaBasic){
    this.form.controls["commessaId"].setValue(commessa.commessaId);
    this._titoloResocontoLavoro = `Resoconto lavoro per il cliente ${this._clienteSelezionato.nome} - commessa ${commessa.nome}`;
    this.loadResocontiHistory(commessa.commessaId);
  }

  onSubmit(){
    this._showUpdatingCover = true;
    if(this.form.controls["tipologialavoro"].value == 2) {
      if (this.form.controls["spese"].value> 0 || this.form.controls["km"].value > 0){
        alert("Il valore di spese e chilometri verrà impstato a 0.\nNon si possono aggiungere spese e chiloetri se il tipo di lavoro è diverso da [ Installazione ].");
        this.form.controls["spese"].setValue(0);
        this.form.controls["km"].setValue(0);
      }
    }
    let r: ResocontoLavoro = <ResocontoLavoro> this.form.value;
    this._api.postSalvataggioResocontoLavoro(r).subscribe((res)=>{
      if(res['error'] === undefined ){
        alert("Resoconto lavoro salvato correttamente.\nRighe inserite nel database : " + res['rowEffected'] 
        +"\n\nLe righe inserite nel database devo essere il numero di scontrini inseriti + 1");
        this.loadResocontiHistory(r.commessaId);
        this._showUpdatingCover = false;
      }
      else{
        alert("Errore salvataggio:\n"+res['error']);
      }
      
    });
  }



  onFileChange(event, index){
    
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        
        console.log((this.form.controls["scontrini"] as FormArray).controls[index].value.body);
        var img = reader.result;
        (this.form.controls["scontrini"] as FormArray).controls[index].value.body = img;
        
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

      
  }

  //rimozione scontrino dalla form in base all'index passato alla funzione
  rimuoviScontrino(index: number){
    (this.form.controls["scontrini"] as FormArray).removeAt(index);
  }
  
}



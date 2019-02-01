export class ResocontoLavoro {
    utenteId: number;
    commessaId: number;
    dataintervento: Date = new Date();
    totalelavoro: number = 0;
    totaleviaggio: number = 0;
    spese: number = 0;
    km: number = 0;
    info: string = "";
    tipologialavoro: number = 2;
}
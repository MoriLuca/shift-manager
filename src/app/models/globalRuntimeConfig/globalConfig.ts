import { IUser } from '../users/IUser';
import { User } from '../users/user';

export class GlobalRuntimeConfig {
    titoloApp = "GiDi Automazione"
    lang = 0;
    // user: IUser = new User();
    user: IUser = {id: 3, nome: "Luca", cognome: "Mori", role: 2};
  }
import { IUser } from '../users/IUser';
import { User } from '../users/user';

export class GlobalRuntimeConfig {
    titoloApp = "Riboni | Tsune"
    lang = 0;
    user: IUser = new User();
}
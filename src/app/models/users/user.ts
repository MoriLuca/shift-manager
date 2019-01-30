import {IUser} from '../users/IUser';

export class User implements IUser
{
    id: number;    
    nome: string;
    cognome: string;
    role: number;
}
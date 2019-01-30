import {
  Injectable
} from '@angular/core';
import { config } from 'rxjs';
import { GlobalRuntimeConfig } from '../../models/globalRuntimeConfig/globalConfig';

@Injectable({
  providedIn: 'root'
})
export class GlobalRuntimeConfigService {

  config = new GlobalRuntimeConfig();

  constructor() {}

  getConfig(): GlobalRuntimeConfig{
    return this.config;
  }
}

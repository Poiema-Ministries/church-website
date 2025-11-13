import { Sermon } from './models';

export interface SermonsReponse {
  status: number;
  response: Sermon[];
}

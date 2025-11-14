// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { Sermon } from './models';

export interface SermonsReponse {
  status: number;
  response: Sermon[];
}

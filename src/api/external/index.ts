import request from './service';

import type { IPDetails } from './types';

export const getIpDetails = (ip: string) => {
  return request.get<IPDetails>({
    url: `http://ip-api.com/json/${ip}?lang=zh-CN`,
    method: 'get',
  });
};

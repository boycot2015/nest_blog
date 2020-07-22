// user.decorator.ts
import { createParamDecorator } from '@nestjs/common';
// export const User = createParamDecorator((data, req) => {
//   console.log({ data, ...req }, 'req.header'); // test
//   return req.user;
// });
export const User = createParamDecorator((data: unknown, req) => {
    const request = req.switchToHttp().getRequest();
    // console.log(data, request.user, 'req.header');
    return request.user;
})

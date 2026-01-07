import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'supersecret', // AuthModule
    });
  }

async validate(payload: any) {
  return {
    sub: payload.sub,        // 🔥 req.user.id buradan gelir
    email: payload.email,
    username: payload.username,
    role: payload.role,
  };
}


}

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
    sub: payload.sub,
    userId: payload.sub,     // ✅ req.user.userId için eklendi
    id: payload.sub,         // ✅ req.user.id için eklendi (backward compatibility)
    email: payload.email,
    username: payload.username,
    role: payload.role,
  };
}


}

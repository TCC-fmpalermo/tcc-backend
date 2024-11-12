import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    
    const passwordIsValid = await argon2.verify(user.password, password);
    
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const payload = { 
      id: user.id.toString(), 
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email, 
      role: user.role, 
      status: user.status 
    };
    
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
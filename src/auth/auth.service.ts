import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from 'src/users/entities/user.entity';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private permissionsService: PermissionsService
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidas');
    }
    
    const passwordIsValid = await argon2.verify(user.password, password);
    
    if(user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuário inativo ou pendente de aprovação');
    }

    if (!passwordIsValid) {
      throw new UnauthorizedException('E-mail ou senha inválidas');
    }

    const permissions = this.permissionsService.getPermissionsForRole(user.role);
    
    const payload = { 
      id: user.id, 
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email, 
      role: user.role, 
      permissions: permissions,
      status: user.status 
    };
    
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
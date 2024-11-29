import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Verifica se a requisição é do tipo EventSource
    if (this.isEventSource(request)) {
      const token = this.extractTokenFromQuery(request);
      if (!token) {
        throw new UnauthorizedException("Usuário não autenticado");
      }
      return this.validateToken(request, token);
    }

    // Caso contrário, verifica o token no cabeçalho
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Usuário não autenticado");
    }

    return this.validateToken(request, token);
  }

  private isEventSource(request: Request): boolean {
    return request.headers.accept === 'text/event-stream';
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromQuery(request: Request): string | undefined {
    return request.query.token as string | undefined;
  }

  private async validateToken(request: Request, token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Usuário não autenticado");
    }
  }
}

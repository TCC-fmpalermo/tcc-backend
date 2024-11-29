// src/custom.d.ts

import * as express from 'express';

// Estende a interface Request para incluir a propriedade `user`
declare global {
  namespace Express {
    interface Request {
      user?: any; // ou defina o tipo correto para o seu `user`, como por exemplo `JwtPayload`
    }
  }
}

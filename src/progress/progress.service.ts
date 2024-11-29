import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ProgressService {
    private userStreams = new Map<number, Response>();

    registerStream(userId: number, res: Response) {
        this.userStreams.set(userId, res);
    }
    
    unregisterStream(userId: number) {
        this.userStreams.delete(userId);
    }

    sendProgress(userId: number, progress: number, message: string) {
        const userStream = this.userStreams.get(userId);
        
        if (userStream) {
            const data = { progress, message };
            userStream.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    }
}

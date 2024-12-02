import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Instance } from '../entities/instance.entity';

@Injectable()
export class GuacamoleService {
    private readonly CIPHER = process.env.GUACAMOLE_CYPHER;
    private readonly SECRET_KEY = process.env.GUACAMOLE_SECRET_KEY;

    encryptToken(data: object): string {
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipheriv(this.CIPHER, Buffer.from(this.SECRET_KEY), iv);

        let encrypted = cipher.update(JSON.stringify(data));
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return Buffer.from(
            JSON.stringify({
                iv: iv.toString('base64'),
                value: encrypted.toString('base64'),
            }),
        ).toString('base64');
    }

    generateGuacamoleToken(instance: Instance): string {
        const connectionData = {
            connection: {
                type: 'rdp',
                settings: {
                    hostname: instance.ipAddress,
                    username: instance.username,
                    password: instance.password, 
                    width: 1820,
                    height: 900,
                },
            },
        };

        return this.encryptToken(connectionData);
    }
}

import { cpSync } from 'fs';

cpSync('src/emails', 'build/src/emails', { recursive: true });

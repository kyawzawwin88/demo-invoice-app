import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

@Controller()
export class AppController {
  @Get(['/', '/invoices'])
  renderReactApp(@Res() res: Response) {
    const indexHtml = readFileSync(join(__dirname, 'ui', 'index.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(indexHtml);
  }
}

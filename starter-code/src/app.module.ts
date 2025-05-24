import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { appConfig } from './app.config';
import { InvoiceModule } from './api/invoice/invoice.module';
import { InvoiceEntity } from './api/invoice/infrastructures/invoice.dao';
import { InvoiceItemEntity } from './api/invoice/infrastructures/invoice-item.dao';
import { AddressEntity } from './api/invoice/infrastructures/address.dao';
import { AuditLogEntity } from './api/audit-log/infrastructures/audit-log.dao';
import { AuditLogModule } from './api/audit-log/audit-log.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'ui/'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (config: ConfigType<typeof appConfig>) => ({
        type: 'mysql',
        host: config.database.host,
        port: config.database.port,
        username: config.database.username,
        password: config.database.password,
        database: config.database.name,
        entities: [InvoiceEntity, InvoiceItemEntity, AddressEntity, AuditLogEntity],
        synchronize: false,
      }),
    }),
    InvoiceModule,
    AuditLogModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

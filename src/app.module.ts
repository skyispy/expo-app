import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as mysql from 'mysql2/promise';

const DBProvider = {
  provide: 'MYSQL_POOL',
  useFactory: () => {
    return mysql.createPool({
      host: 'localhost',
      user: '',
      port: 3306,
      password: '',
      database: '',
      connectionLimit: 10,
      waitForConnections: true,
    });
  },
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DBProvider],
  exports: [DBProvider],
})
export class AppModule {}

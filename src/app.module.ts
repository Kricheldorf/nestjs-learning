import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { dataSourceOptions } from './data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UsersFetcherModule } from './users-fetcher/users-fetcher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `./config/.env` }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    UsersFetcherModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

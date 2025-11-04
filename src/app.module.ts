import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { Scalar } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubgraphModule } from './subgraph/generated/subgraph.module';
import { ServerModule } from './server/server.module';
import { TaskModule } from './task/task.module';
import BigInt from 'apollo-type-bigint';

const chainEnvFilePath = `.env.${process.env.NODE_ENV || 'prod'}`;

@Scalar('BigInt')
export class BigIntScalar extends BigInt {}

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: ['.env', chainEnvFilePath],
          isGlobal: true,
      }),
      ScheduleModule.forRoot(),
      SubgraphModule,
      ServerModule,
      TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService, BigIntScalar],
})
export class AppModule {}

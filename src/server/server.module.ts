import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { TaskModule } from "../task/task.module";

@Module({
  imports: [TaskModule],
  controllers: [ServerController],
  providers: [ServerService]
})
export class ServerModule {}

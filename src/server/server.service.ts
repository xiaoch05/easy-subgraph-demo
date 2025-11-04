import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TaskService } from '../task/task.service';
import { ChainManager } from '../subgraph/generated/src/event.chain';

export const chainManagerGlobal = new ChainManager();
@Injectable()
export class ServerService implements OnModuleInit {
    private readonly logger = new Logger("server");
    private syncing: boolean = false;

    constructor(
        private taskService: TaskService,
    ) {}

    async onModuleInit() {
        this.logger.log("server service start");
        const chainList = process.env.CHAINS.split(",").map(Number);
        const urls = chainManagerGlobal.scaners.filter(scaner => {
            return chainList.find(c => c === Number(scaner.chainId)) !== undefined;
        }).map(scaner => {
            return {
                chainId: scaner.chainId,
                name: scaner.name,
                urls: scaner.urlStates
            }
        });

        this.logger.log(`It's running, start init dex ${chainList}`);
        chainManagerGlobal.scaners.filter(scaner => {
            return chainList.find(c => c === Number(scaner.chainId)) !== undefined;
        }).forEach((scaner, index) => {
            this.taskService.addInterval(
                `${scaner.chainId}`,
                scaner.scanInterval,
                async () => {
                    if (this.syncing) return;
                    await scaner.scan();
                }
            );
        });
    }
}

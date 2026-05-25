import {
    Swap,
} from "../generated/UniswapV4Pool.UniswapV4Pool";
import {
    UniswapV4Slot0,
} from "../generated/schema";

export async function handleSwap(event: Swap): Promise<void> {
    const id = `${event.context.chainId}-${event.params.id}`;
    const now = `${Date.now() / 1000}`;

    // save db
    {
        let entity = await UniswapV4Slot0.load(id);
        if (entity === null) {
            entity = new UniswapV4Slot0(id);
        }
        entity.chainId = BigInt(event.context.chainId);
        entity.pool = event.params.id;
        entity.sqrtPriceX96 = event.params.sqrtPriceX96.toString();
        entity.liquidity = event.params.liquidity.toString();
        entity.tick = event.params.tick.toString();
        await entity.save();
    }
    // save memory
    {
        let memEntity = UniswapV4Slot0.memLoad(id);
        if (memEntity == null) {
            return;
        }
        memEntity.chainId = event.context.chainId;
        memEntity.pool = event.params.id;
        memEntity.tick = event.params.tick.toString();
        memEntity.sqrtPriceX96 = event.params.sqrtPriceX96.toString();
        memEntity.liquidity = event.params.liquidity.toString();
        memEntity.timestamp = now;
        memEntity.memSave();
    }
}

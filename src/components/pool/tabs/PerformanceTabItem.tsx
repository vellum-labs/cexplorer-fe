import { getRouteApi } from "@tanstack/react-router";
import PoolPerformanceGraph from "../graphs/PoolPerformanceGraph";
import { usePoolPerfomanceGraph } from "@/hooks/pool/usePoolPerfomanceGraph";
import { memo } from "react";
import { PoolPerfomanceTable } from "../PoolPerfomanceTable";

const PerformanceTabItem = memo(function PerfomanceTabItem() {
  const route = getRouteApi("/pool/$id");
  const { id } = route.useParams();

  const { activeStake, blocks, delegators, epochs, luck, pledged, roa } =
    usePoolPerfomanceGraph(id);

  return (
    <div>
      <div className='relative w-full'>
        <h2 className='mb-1'>Performance</h2>
        <PoolPerformanceGraph
          activeStake={activeStake}
          blocks={blocks}
          delegators={delegators}
          epochs={epochs}
          luck={luck}
          pledged={pledged}
          roa={roa}
        />
      </div>
      <div className='flex flex-col items-end gap-2'>
        <PoolPerfomanceTable poolId={id} />
      </div>
    </div>
  );
});

export default PerformanceTabItem;

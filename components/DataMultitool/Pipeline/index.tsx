import { Droppable } from "@hello-pangea/dnd";
import { useAppSelector } from "../ducks";
import { selectPipelineById } from "../ducks/pipelinesSlice";
import PipelineStep from "../PipelineStep";

export interface PipelineProps {
  id: string;
}

export default function Pipeline({ id }: PipelineProps) {
  const pipeline = useAppSelector(s => selectPipelineById(s, id));

  return (
    <Droppable droppableId={id}>
      {pr => (
        <div ref={pr.innerRef} {...pr.droppableProps}>
          {pipeline.step_ids.map((id, index) => (
            <PipelineStep id={id} key={id} index={index} />
          ))}
          {pr.placeholder}
        </div>
      )}
    </Droppable>
  );
}

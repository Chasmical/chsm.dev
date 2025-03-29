import { Draggable } from "@hello-pangea/dnd";
import { useAppSelector } from "../ducks";
import { type PipelineStep, selectPipelineStepById } from "../ducks/pipelineStepsSlice";
import styles from "./index.module.scss";

export interface PipelineStepProps {
  id: string;
  index: number;
}

export default function PipelineStep({ id, index }: PipelineStepProps) {
  const step = useAppSelector(s => selectPipelineStepById(s, id));
  const Component = componentMap[step.type as keyof typeof componentMap];

  return (
    <Draggable draggableId={id} index={index}>
      {pr => (
        <div className={styles.wrapper} ref={pr.innerRef} {...pr.draggableProps} {...pr.dragHandleProps}>
          <div className={styles.panel}>
            <div className={styles.sidebar}>
              <div>{"×"}</div>
              <div>{"⋮"}</div>
            </div>
            <div className={styles.container}>
              <Component step={step} key={step.type} />
            </div>
          </div>
          <div className={styles.outputPane}>vvvvv</div>
        </div>
      )}
    </Draggable>
  );
}

const componentMap = {
  TextInput,
};

function TextInput({ step }: { step: PipelineStep }) {
  return <></>;
}

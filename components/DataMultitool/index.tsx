"use client";
import { useCallback, useMemo } from "react";
import { DragDropContext, type OnDragEndResponder } from "@hello-pangea/dnd";
import Pipeline from "./Pipeline";
import { createMultitoolStore } from "./ducks";
import { pipelineStepsMoved } from "./ducks/pipelinesSlice";
import { Provider as ReduxProvider } from "react-redux";

export default function DataMultitool() {
  const store = useMemo(createMultitoolStore, []);

  const onDragEnd = useCallback<OnDragEndResponder>(ev => {
    store.dispatch(pipelineStepsMoved(ev));
  }, []);

  return (
    <ReduxProvider store={store}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Pipeline id="init" />
      </DragDropContext>
    </ReduxProvider>
  );
}

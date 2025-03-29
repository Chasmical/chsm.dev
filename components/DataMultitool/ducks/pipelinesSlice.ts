import type { RootState } from ".";
import type { DropResult } from "@hello-pangea/dnd";
import { createEntityAdapter, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";

export interface Pipeline {
  id: string;
  step_ids: string[];
}

const adapter = createEntityAdapter({ selectId: (p: Pipeline) => p.id });

export const { selectById: selectPipelineById } = adapter.getSelectors((s: RootState) => s.pipelines);

const initialState = adapter.getInitialState({}, [{ id: "init", step_ids: ["init-step-1", "init-step-2"] }]);

const slice = createSlice({
  name: "pipelines",
  initialState,
  reducers: {
    pipelineChanged: (state, { payload }: PayloadAction<Partial<Pipeline> & { id: string }>) => {
      const pipeline = state.entities[payload.id];
      merge(pipeline, payload);
    },
    pipelineStepsMoved: (state, { payload: dnd }: PayloadAction<DropResult>) => {
      if (!dnd.destination) return;

      const source = state.entities[dnd.source.droppableId];
      const destination = state.entities[dnd.destination.droppableId];

      const moved = source.step_ids.splice(dnd.source.index, 1)[0];
      destination.step_ids.splice(dnd.destination.index, 0, moved);
    },
  },
});

export const { pipelineChanged, pipelineStepsMoved } = slice.actions;

export default slice.reducer;

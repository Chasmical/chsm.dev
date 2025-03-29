import type { RootState } from ".";
import { createEntityAdapter, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";

export interface PipelineStep {
  id: string;
  type: string;
}

const adapter = createEntityAdapter({ selectId: (p: PipelineStep) => p.id });

export const { selectById: selectPipelineStepById } = adapter.getSelectors((s: RootState) => s.pipeline_steps);

const initialState = adapter.getInitialState({}, [
  { id: "init-step-1", type: "TextInput" },
  { id: "init-step-2", type: "TextInput" },
]);

const slice = createSlice({
  name: "pipeline-steps",
  initialState,
  reducers: {
    pipelineStepChanged: (state, { payload }: PayloadAction<Partial<PipelineStep> & { id: string }>) => {
      const step = state.entities[payload.id];
      merge(step, payload);
    },
  },
});

export const { pipelineStepChanged } = slice.actions;

export default slice.reducer;

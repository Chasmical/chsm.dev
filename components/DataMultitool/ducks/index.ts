import { useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import pipelinesReducer from "./pipelinesSlice";
import pipelineStepsReducer from "./pipelineStepsSlice";

export function createMultitoolStore() {
  return configureStore({
    reducer: {
      pipelines: pipelinesReducer,
      pipeline_steps: pipelineStepsReducer,
    },
  });
}

export type AppStore = ReturnType<typeof createMultitoolStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

import { configureStore } from "@reduxjs/toolkit";
import excelReducer from "./slices/excelSlice";

export const store = configureStore({
  reducer: {
    excel: excelReducer,
  },
});
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  originalData: [],
  loading: false,
  error: null,
};

const excelSlice = createSlice({
  name: "excel",
  initialState,
  reducers: {
    setExcelData(state, action) {
      state.data = action.payload;
      state.originalData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    updateRow(state, action) {
      const { index, row } = action.payload;
      state.data[index] = row;
    },
    // Add more reducers as needed (e.g., for filtering, editing, etc.)
  },
});

export const { setExcelData, setLoading, setError, updateRow } = excelSlice.actions;
export default excelSlice.reducer;
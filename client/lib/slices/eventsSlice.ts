import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SliceType = {
  monthDayEventsNumber: number[];
  selectedDateISOString: string | null;
};

const initialState: SliceType = {
  monthDayEventsNumber: [],
  selectedDateISOString: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setMonthDayEventsNumber: (state, action: PayloadAction<number[]>) => {
      state.monthDayEventsNumber = action.payload;
    },
    incrementDayEventsNumber: (state, action: PayloadAction<number>) => {
      state.monthDayEventsNumber[action.payload]++;
    },
    decrementDayEventsNumber: (state, action: PayloadAction<number>) => {
      state.monthDayEventsNumber[action.payload]--;
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDateISOString = action.payload;
    },
  },
});

export const {
  setMonthDayEventsNumber,
  incrementDayEventsNumber,
  decrementDayEventsNumber,
  setSelectedDate,
} = eventsSlice.actions;
export default eventsSlice.reducer;

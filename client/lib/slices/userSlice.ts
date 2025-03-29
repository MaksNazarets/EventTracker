import { User } from "@/types";
import API from "@/utils/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getMe = createAsyncThunk(
  "user/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/me");

      return res.data.user;
    } catch (error: any) {
      if (error.response?.status === 401)
        return rejectWithValue({ error: "You are not logged in" });
      else if (error.response?.data?.error)
        return rejectWithValue({ error: error.response.data.error });
      else {
        console.error(error);
        return rejectWithValue({ error: "Unexpected error" });
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.post("/login", { email, password });

      return res.data.user;
    } catch (error: any) {
      if (error.response?.data?.error)
        return rejectWithValue({ error: error.response.data.error });
      else {
        console.error(error);
        return rejectWithValue({ error: "Unexpected error" });
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.post("/logout");
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  }
);

const initialState: User = { id: 0, name: "", email: "" };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        const { id, name, email } = action.payload;

        state.id = id;
        state.name = name;
        state.email = email;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error(action.payload);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.id = 0;
        state.name = "";
        state.email = "";
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
        const { id, name, email } = action.payload;

        state.id = id;
        state.name = name;
        state.email = email;
      })
      .addCase(getMe.rejected, (state) => {
        state.id = 0;
        state.name = "";
        state.email = "";
      });
  },
});

export default userSlice.reducer;

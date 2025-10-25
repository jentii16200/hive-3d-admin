import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatar: string | null;
  createdAt: string | null;
}

const initialState: { value: User[] } = { value: [] };

const userAction = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.value.push(action.payload);
    },

    setUser: (state, action: PayloadAction<User[]>) => {
      state.value = action.payload;
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.value = state.value.map((user) =>
        user.id === action.payload.id ? { ...user, ...action.payload } : user
      );
    },

    removeUser: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter((user) => user.id !== action.payload);
    },

    clearUser: (state) => {
      state.value = [];
    },
  },
});

export const { addUser, setUser, updateUser, removeUser, clearUser } = userAction.actions;
export default userAction.reducer;

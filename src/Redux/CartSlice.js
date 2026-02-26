import { createSlice } from '@reduxjs/toolkit';

// Initial states
const initialUserState = { data: null };

/*  User */
const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
         setUser: (state, action) => {
                console.log("Setting user:", action.payload);
                state.data = action.payload;
         },
         removeUser: (state) => {
                console.log("Removing user");
                state.data = null;
         },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export const userReducer = userSlice.reducer;

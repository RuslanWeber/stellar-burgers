import {
  TLoginData,
  TRegisterData,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '../../utils/types';
import { deleteCookie, setCookie } from '../../utils/cookie';

/** Авторизация пользователя по логину и пароля */
export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  async (data: TLoginData) =>
    loginUserApi(data).then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    })
);

/** Разлогин/выход пользователя */
export const logoutUserThunk = createAsyncThunk('users/logoutUser', async () =>
  logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  })
);

/** Загрузка данных пользователя */
export const getUserThunk = createAsyncThunk('users/getUser', async () =>
  getUserApi()
);

/** Регистрация пользователя */
export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  async (data: TRegisterData) =>
    registerUserApi(data).then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    })
);

/** Обновление данных пользователя */
export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

/** Получение истории заказов пользователя */
export const getOrdersThunk = createAsyncThunk(
  'users/getUserOrders',
  async () => getOrdersApi()
);

export interface UserState {
  isUserAuthenticated: boolean;
  isLoginUserRequest: boolean;
  user: TUser | null;
  orders: TOrder[];
  isOrdersRequest: boolean;
  error: string | null;
}

const initialState: UserState = {
  isUserAuthenticated: false,
  isLoginUserRequest: false,
  user: null,
  orders: [],
  isOrdersRequest: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    isUserAuthenticatedSelector: (state) => state.isUserAuthenticated,
    isLoginUserRequestSelector: (state) => state.isLoginUserRequest,
    userNameSelector: (state) => state.user?.name || '',
    userEmailSelector: (state) => state.user?.email || '',
    userSelector: (state) => state.user,

    userOrdersSelector: (state) => state.orders,
    isOrdersRequestSelector: (state) => state.isOrdersRequest,

    errorSelector: (state) => state.error
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoginUserRequest = false;
        state.isUserAuthenticated = true;
      });

    builder.addCase(logoutUserThunk.pending, (state) => {
      state.user = null;
      state.isLoginUserRequest = false;
      state.isUserAuthenticated = false;
    });

    builder
      .addCase(getUserThunk.pending, (state) => {
        state.isLoginUserRequest = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.user = null;
        state.isLoginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoginUserRequest = false;
        state.isUserAuthenticated = true;
      });

    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isUserAuthenticated = false;
        state.isLoginUserRequest = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isUserAuthenticated = false;
        state.isLoginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoginUserRequest = false;
        state.isUserAuthenticated = true;
      });

    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoginUserRequest = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoginUserRequest = false;
        state.isUserAuthenticated = true;
      });

    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.isOrdersRequest = true;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.error = action.error.message!;
        state.isOrdersRequest = false;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isOrdersRequest = false;
      });
  }
});

export const { clearErrors } = userSlice.actions;
export const {
  isUserAuthenticatedSelector,
  userNameSelector,
  userEmailSelector,
  userSelector,
  isLoginUserRequestSelector,

  userOrdersSelector,
  isOrdersRequestSelector,

  errorSelector
} = userSlice.selectors;
export default userSlice.reducer;

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
import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction
} from '@reduxjs/toolkit';
import { TOrder, TUser } from '../../utils/types';
import { deleteCookie, setCookie } from '../../utils/cookie';

const authFlowWrapper = async <T>(authFn: () => Promise<T>) => {
  const response = await authFn();
  return response;
};

const tokenManager = {
  setTokens: (accessToken: string, refreshToken: string) => {
    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clearTokens: () => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export const authorizeUser = createAsyncThunk(
  'user/authFlow',
  async (credentials: TLoginData) => {
    const response = await authFlowWrapper(() => loginUserApi(credentials));
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const signOutUser = createAsyncThunk('user/cleanSession', async () => {
  await authFlowWrapper(logoutApi);
  tokenManager.clearTokens();
});

export const fetchUserProfile = createAsyncThunk(
  'user/loadProfile',
  async () => {
    const response = await authFlowWrapper(getUserApi);
    return response;
  }
);

export const registerNewUser = createAsyncThunk(
  'user/createAccount',
  async (formData: TRegisterData) => {
    const response = await authFlowWrapper(() => registerUserApi(formData));
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/patchProfile',
  async (updates: Partial<TRegisterData>) => {
    const response = await authFlowWrapper(() => updateUserApi(updates));
    return response;
  }
);

export const loadUserOrders = createAsyncThunk(
  'user/getOrderHistory',
  async () => {
    const orders = await authFlowWrapper(getOrdersApi);
    return orders;
  }
);

interface UserState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: TUser | null;
  orders: TOrder[];
  isFetchingOrders: boolean;
  errorMessage: string | null;
  lastAction: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  orders: [],
  isFetchingOrders: false,
  errorMessage: null,
  lastAction: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError: (state) => {
      state.errorMessage = null;
    },
    trackAction: (state, action: PayloadAction<string>) => {
      state.lastAction = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authorizeUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.errorMessage = null;
        state.lastAction = 'authSuccess';
      })
      .addCase(registerNewUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.errorMessage = null;
        state.lastAction = 'authSuccess';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.lastAction = 'profileLoaded';
      })
      .addCase(signOutUser.pending, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.lastAction = 'signOut';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.lastAction = 'profileUpdated';
      })
      .addCase(loadUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isFetchingOrders = false;
        state.lastAction = 'ordersLoaded';
      })
      .addCase(loadUserOrders.pending, (state) => {
        state.isFetchingOrders = true;
        state.errorMessage = null;
      })
      .addCase(loadUserOrders.rejected, (state, action) => {
        state.isFetchingOrders = false;
        state.errorMessage = action.error.message ?? 'Order load failed';
        state.lastAction = 'ordersLoadFailed';
      });

    builder
      .addMatcher(
        isAnyOf(
          authorizeUser.pending,
          registerNewUser.pending,
          fetchUserProfile.pending,
          updateUserProfile.pending
        ),
        (state) => {
          state.isLoading = true;
          state.errorMessage = null;
        }
      )
      .addMatcher(
        isAnyOf(
          authorizeUser.rejected,
          registerNewUser.rejected,
          fetchUserProfile.rejected,
          updateUserProfile.rejected
        ),
        (state, action) => {
          state.isLoading = false;
          state.errorMessage = action.error.message ?? 'Operation failed';
          state.lastAction = 'actionFailed';
        }
      );
  },
  selectors: {
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsLoading: (state) => state.isLoading,
    selectUserName: (state) => state.user?.name ?? '',
    selectUserEmail: (state) => state.user?.email ?? '',
    selectUserData: (state) => state.user,
    selectUserOrders: (state) => state.orders,
    selectIsFetchingOrders: (state) => state.isFetchingOrders,
    selectErrorMessage: (state) => state.errorMessage,
    selectLastAction: (state) => state.lastAction
  }
});

export const { resetError, trackAction } = userSlice.actions;
export const {
  selectIsAuthenticated,
  selectUserName,
  selectUserEmail,
  selectUserData,
  selectIsLoading,
  selectUserOrders,
  selectIsFetchingOrders,
  selectErrorMessage,
  selectLastAction
} = userSlice.selectors;

export default userSlice.reducer;

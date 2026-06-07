import { useAppDispatch, useAppSelector } from './useRedux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
} from '@store/authSlice';
import { LoginInput, RegisterInput } from '@constants/validation';
import { ApiResponse, AuthUser } from '../types/index';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated, token } = useAppSelector((state) => state.auth);

  const handleLogin = async (credentials: LoginInput) => {
    dispatch(loginStart());
    try {
      // TODO: Replace with actual API call
      const response: ApiResponse<AuthUser> = {
        success: true,
        data: {
          id: '1',
          phone: credentials.phone,
          firstName: 'John',
          lastName: 'Doe',
          kycStatus: 'verified',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      if (response.success && response.data) {
        dispatch(loginSuccess(response.data));
      } else {
        dispatch(loginFailure(response.error || 'Login failed'));
      }
    } catch (error: any) {
      dispatch(loginFailure(error?.message || 'Login failed'));
    }
  };

  const handleRegister = async (credentials: RegisterInput) => {
    dispatch(registerStart());
    try {
      // TODO: Replace with actual API call
      const response: ApiResponse<AuthUser> = {
        success: true,
        data: {
          id: '1',
          phone: credentials.phone,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          email: credentials.email,
          kycStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      if (response.success && response.data) {
        dispatch(registerSuccess(response.data));
      } else {
        dispatch(registerFailure(response.error || 'Registration failed'));
      }
    } catch (error: any) {
      dispatch(registerFailure(error?.message || 'Registration failed'));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    token,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: handleClearError,
  };
};

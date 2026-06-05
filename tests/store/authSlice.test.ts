import { store } from '@store/store';
import { loginSuccess, loginFailure, logout } from '@store/authSlice';
import { AuthUser } from '@types/index';

describe('Auth Slice', () => {
  describe('loginSuccess', () => {
    it('should set user and tokens on login success', () => {
      const user: AuthUser = {
        id: '1',
        phone: '+22501234567',
        firstName: 'John',
        lastName: 'Doe',
        kycStatus: 'verified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        token: 'mock-token',
        refreshToken: 'mock-refresh',
      };

      store.dispatch(loginSuccess(user));
      const state = store.getState();

      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.user).toEqual(user);
      expect(state.auth.token).toBe('mock-token');
    });
  });

  describe('loginFailure', () => {
    it('should set error on login failure', () => {
      store.dispatch(loginFailure('Invalid credentials'));
      const state = store.getState();

      expect(state.auth.error).toBe('Invalid credentials');
      expect(state.auth.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', () => {
      store.dispatch(logout());
      const state = store.getState();

      expect(state.auth.user).toBeNull();
      expect(state.auth.isAuthenticated).toBe(false);
      expect(state.auth.token).toBeNull();
    });
  });
});

import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { store } from './store';
import { login } from './slices/authSlice';

beforeAll(() => {
  server.listen();
  store.dispatch(
    login.fulfilled(
      {
        user: { id: '1', username: 'admin', role: 'Admin' },
        access_token: 'mock-token',
      },
      'mock-request-id',
      { username: 'admin', password: 'admin123' }
    )
  );
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import { store } from '../store';
import Dashboard from '../components/Dashboard';

describe('Dashboard Component', () => {
  it('renders dashboard for Admin with mock data', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByText('Add Patient')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('renders dashboard for Doctor with mock data', async () => {
    store.dispatch({
      type: 'auth/login/fulfilled',
      payload: { user: { id: '2', username: 'doctor', role: 'Doctor' }, access_token: 'mock-doctor-token' },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.queryByText('Add Patient')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('renders dashboard for Nurse with mock data', async () => {
    store.dispatch({
      type: 'auth/login/fulfilled',
      payload: { user: { id: '3', username: 'nurse', role: 'Nurse' }, access_token: 'mock-nurse-token' },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.queryByText('Add Patient')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
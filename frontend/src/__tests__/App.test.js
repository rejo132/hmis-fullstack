import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { act } from 'react';
import { store } from '../store';
import App from '../App';

describe('App Component', () => {
  it('renders dashboard for authenticated Admin', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
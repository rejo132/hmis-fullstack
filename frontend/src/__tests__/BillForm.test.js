import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import { store } from '../store';
import BillForm from '../components/BillForm';

describe('BillForm Component', () => {
  it('submits bill data', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BillForm />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    }, { timeout: 2000 });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Patient'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
      fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Consultation' } });
      fireEvent.click(screen.getByRole('button', { name: /generate bill/i }));
    });

    await waitFor(() => {
      expect(store.getState().bills.bills).toContainEqual(
        expect.objectContaining({ patient_id: '1', amount: '100', description: 'Consultation', payment_status: 'Pending' })
      );
    }, { timeout: 2000 });
  });
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import { store } from '../store';
import RecordForm from '../components/RecordForm';

describe('RecordForm Component', () => {
  it('submits record data', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RecordForm />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    }, { timeout: 2000 });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Patient'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Diagnosis'), { target: { value: 'Flu' } });
      fireEvent.change(screen.getByLabelText('Vital Signs'), { target: { value: 'Normal' } });
      fireEvent.click(screen.getByRole('button', { name: /add record/i }));
    });

    await waitFor(() => {
      expect(store.getState().records.records).toContainEqual(
        expect.objectContaining({ patient_id: '1', diagnosis: 'Flu', vital_signs: 'Normal', prescription: '' })
      );
    }, { timeout: 2000 });
  });
});
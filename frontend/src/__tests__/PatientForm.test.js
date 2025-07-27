import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import { store } from '../store';
import PatientForm from '../components/PatientForm';

describe('PatientForm Component', () => {
  it('submits patient data', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PatientForm />
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText('Date of Birth'), { target: { value: '1990-01-01' } });
      fireEvent.change(screen.getByLabelText('Contact'), { target: { value: '1234567890' } });
      fireEvent.click(screen.getByRole('button', { name: /add patient/i }));
    });

    await waitFor(() => {
      expect(store.getState().patients.patients).toContainEqual(
        expect.objectContaining({ name: 'John Doe', dob: '1990-01-01', contact: '1234567890' })
      );
    }, { timeout: 2000 });
  });
});
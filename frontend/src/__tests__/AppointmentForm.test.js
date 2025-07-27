import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import { store } from '../store';
import AppointmentForm from '../components/AppointmentForm';

describe('AppointmentForm Component', () => {
  it('submits appointment data', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AppointmentForm />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    }, { timeout: 2000 });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Patient'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Appointment Time'), { target: { value: '2025-07-17T10:00' } });
      fireEvent.click(screen.getByRole('button', { name: /schedule appointment/i }));
    });

    await waitFor(() => {
      expect(store.getState().appointments.appointments).toContainEqual(
        expect.objectContaining({ patient_id: '1', appointment_time: '2025-07-17T10:00', status: 'Scheduled' })
      );
    }, { timeout: 2000 });
  });
});
// Cypress role-based UI test for all demo users
const users = [
  { username: 'admin', role: 'Admin', dashboard: '/dashboard' },
  { username: 'doctor1', role: 'Doctor', dashboard: '/doctor-portal' },
  { username: 'nurse1', role: 'Nurse', dashboard: '/vitals' },
  { username: 'it1', role: 'IT', dashboard: '/users/roles' },
  { username: 'labtech1', role: 'Lab Tech', dashboard: '/lab-orders' },
  { username: 'receptionist1', role: 'Receptionist', dashboard: '/reception' },
  { username: 'billing1', role: 'Billing', dashboard: '/billing' },
  { username: 'accountant1', role: 'Accountant', dashboard: '/finance' },
  { username: 'pharmacist1', role: 'Pharmacist', dashboard: '/inventory' },
  { username: 'patient1', role: 'Patient', dashboard: '/patient-portal' },
];

describe('Role-based UI access', () => {
  users.forEach(({ username, role, dashboard }) => {
    it(`should log in as ${role} and see correct dashboard`, () => {
      cy.visit('/');
      cy.get('input[name="username"]').clear().type(username);
      cy.get('input[name="password"]').clear().type('password123');
      cy.get('button[type="submit"]').click();
      // Wait for redirect
      cy.url().should('include', dashboard);
      // Check for role in UI (profile dropdown or header)
      cy.contains(role, { matchCase: false });
    });
  });

  it('should deny access to /users/roles for non-IT/Admin users', () => {
    // Try as Doctor
    cy.visit('/');
    cy.get('input[name="username"]').clear().type('doctor1');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();
    cy.visit('/users/roles');
    cy.url().should('not.include', '/users/roles');
    cy.contains(/unauthorized|dashboard/i);
  });
}); 
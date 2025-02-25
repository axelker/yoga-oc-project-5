/// <reference types="Cypress" />

describe('Login Page', () => {
  it('Should redirects to the sessions page after a successful login', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  })

  it('Should displays an error message when login fails', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginError');
    
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/login')
    cy.get('.error').should('be.visible').and('contain', "An error occurred");
  });

  it('Should disable submit form button when invalid form', () => {
    cy.visit('/login')

    
    cy.get('input[formControlName=email]').type("invalid.com").blur();
    cy.get('input[formControlName=password]').focus().blur();
    

    cy.get('input[formControlName=email]').should('have.class', 'ng-invalid');
    cy.get('input[formControlName=password]').should('have.class', 'ng-invalid');
    cy.url().should('include', '/login')
    cy.get('button[type=submit]').should('be.disabled');
  })
  
});
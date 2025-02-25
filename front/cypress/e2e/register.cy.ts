describe('Register Page', () => {
    it('Should redirects to the login page after a successful register', () => {
      cy.visit('/register')
  
      cy.intercept('POST', '/api/auth/register', {
       statusCode:200
      })
      
      cy.get('input[formControlName=firstName]').type("testfirstname")
      cy.get('input[formControlName=lastName]').type("testlastname")
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.url().should('include', '/login')
    })
  
    it('Should displays an error message when register fails', () => {
    cy.visit('/register')
  
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 500,
        body: { message: 'Error on register' }
      }).as('loginError');
      
      cy.get('input[formControlName=firstName]').type("testfirstname")
      cy.get('input[formControlName=lastName]').type("testlastname")
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.url().should('include', '/register')
      cy.get('.error').should('be.visible').and('contain', "An error occurred");
    });
    
    describe('Invalid form', () => {
        it('Should disable submit form button', () => {
            cy.visit('/register')
        
            cy.get('input[formControlName=firstName]').focus().blur();
            cy.get('input[formControlName=lastName]').focus().blur();
            cy.get('input[formControlName=email]').type("invalid.com").blur();
            cy.get('input[formControlName=password]').focus().blur();
            
            cy.get('input[formControlName=firstName]').should('have.class', 'ng-invalid');
            cy.get('input[formControlName=lastName]').should('have.class', 'ng-invalid');
            cy.get('input[formControlName=email]').should('have.class', 'ng-invalid');
            cy.get('input[formControlName=password]').should('have.class', 'ng-invalid');
            cy.url().should('include', '/register')
            cy.get('button[type=submit]').should('be.disabled');
        });
    })
   
  });
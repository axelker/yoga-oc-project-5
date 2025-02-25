describe('Logout Page', () => {
    it('Should logout user', () => {
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
  
      cy.intercept('GET','/api/session', {
        body:[]
      });
  
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.url().should('include', '/sessions')
      cy.contains('span', 'Logout').click();
      cy.url().should('include', '/');
      cy.contains('span', 'Login').should('be.visible');
      cy.contains('span', 'Register').should('be.visible');
    })
  
    
  });
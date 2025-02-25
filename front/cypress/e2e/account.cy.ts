describe('Account information Page', () => {

  describe('Admin user', () => {
    const admin = {
      token: 'jwt',
      type: 'Bearer',
      id: 1,
      email: 'test@test.com',
      firstName: 'Admin',
      lastName: 'test',
      admin: true,
      createdAt: '2023-02-12T15:33:42',
      updatedAt: '2023-03-12T15:33:42',
  };
    beforeEach(() => {
     
      cy.visit('/login')
  
      cy.intercept('POST', '/api/auth/login', {
        body: admin,
      })
      cy.intercept('GET', `/api/user/${admin.id}`,{
        body: admin,
      });
      cy.intercept('GET','/api/session', {
        body:[]
      });
  
  
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.url().should('include', '/sessions')
    })

  
      it('Displays admin user information correctly', () => {
        cy.contains('span.link', 'Account').click();
    
        cy.get('h1').should('contain', "User information");
    
        cy.get('[data-test-id="user-name"]').should('contain', `Name: ${admin.firstName} ${admin.lastName.toUpperCase()}`);
    
        cy.get('[data-test-id="user-email"]').should('contain', `Email: ${admin.email}`);
    
        cy.get('[data-test-id="admin-text"]').should('be.visible').and('contain', 'You are admin');
    
        cy.get('[data-test-id="delete-section"]').should('not.exist');
    
        cy.get('[data-test-id="create-user-date"]').first().should('contain', 'Create at:');
        cy.get('[data-test-id="update-user-date"]').last().should('contain', 'Last update:');
      });
    
  });

  describe('Basic user', () => {
    const user = {
      token: 'jwt',
      type: 'Bearer',
      id: 2,
      email: 'test@test.com',
      firstName: 'User',
      lastName: 'test',
      admin: false,
      createdAt: '2023-02-12T15:33:42',
      updatedAt: '2023-03-12T15:33:42',
    };
    beforeEach(() => {
      
      cy.visit('/login')
  
      cy.intercept('POST', '/api/auth/login', {
        body: user,
      })
      cy.intercept('GET', `/api/user/${user.id}`,{
        body: user,
      });
      cy.intercept('GET','/api/session', {
        body:[]
      });
  
  
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.url().should('include', '/sessions')
    })

  
      it('Displays user information correctly', () => {
        cy.intercept('DELETE', `/api/user/${user.id}`, {
          statusCode: 200,
        }).as('deleteAccount');
        cy.contains('span.link', 'Account').click();
    
        cy.get('h1').should('contain', "User information");
    
        cy.get('[data-test-id="user-name"]').should('contain', `Name: ${user.firstName} ${user.lastName.toUpperCase()}`);
    
        cy.get('[data-test-id="user-email"]').should('contain', `Email: ${user.email}`);
    
        cy.get('[data-test-id="admin-text"]').should('not.exist');
    
        cy.get('[data-test-id="delete-section"]').should('be.visible');
    
        cy.get('[data-test-id="create-user-date"]').first().should('contain', 'Create at:');
        cy.get('[data-test-id="update-user-date"]').last().should('contain', 'Last update:');
      
        cy.get('[data-test-id="delete-button"]').click();

        cy.wait('@deleteAccount');

        cy.get('.mat-snack-bar-container').should('be.visible')
          .and('contain', 'Your account has been deleted !');

        cy.url().should('include', '/');
      });

    });


});
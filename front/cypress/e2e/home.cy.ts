describe('Home Page', () => {
    it('Should display login and register buttons', () => {
      cy.visit('/')
      cy.contains('span', 'Login').should('be.visible');
      cy.contains('span', 'Register').should('be.visible');
    })
  
});
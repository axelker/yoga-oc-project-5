describe('404 page', () => {
  it('Should display Page not found title', () => {
    cy.visit('notfoundpage');
    cy.get('h1').contains('Page not found !');
  });
});

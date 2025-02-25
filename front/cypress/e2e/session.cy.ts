
describe('Session Page', () => {
    const mockSessionsResponse = [
        {
            id: 1,
            name: 'session1',
            description: 'description',
            date: new Date('2023-05-12'),
            teacher_id: 1,
            users: [],
        },
        {
            id:2,
            name: 'session2',
            description: 'description',
            date: new Date('2023-05-12'),
            teacher_id: 1,
            users: [],
        }
    ];

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

    describe('Admin user',()=> {
        beforeEach(() => {
            cy.visit('/login')
  
            cy.intercept('POST', '/api/auth/login', {
              body: admin,
            })
            cy.intercept('GET','/api/session', {
              body:mockSessionsResponse
            });
        
        
            cy.get('input[formControlName=email]').type("yoga@studio.com")
            cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        
            cy.url().should('include', '/sessions')
        });

        it('Should display two sessions', () => {
            cy.get('.items .item').should('have.length', 2);

            cy.get('.items .item').first().find('mat-card-title').should('contain', 'session1');
            cy.get('.items .item').last().find('mat-card-title').should('contain', 'session2');
        });

        it('Should create a session successfully', () => {
            cy.intercept('POST', '/api/session/', {
                statusCode: 201,
                body: mockSessionsResponse[0]
            });
            const mockTeachers = [
                {
                    id: 1,
                    lastName: "lastname",
                    firstName: "firstname",
                    createdAt: new Date('2023-01-01'),
                    updatedAt: new Date('2023-01-01')
                }
              
            ]
            cy.intercept('GET', '/api/teacher', {
                body: mockTeachers
            });
        
            cy.get('[data-test-id="create-session-button"]').should('be.visible').click();
        
            cy.url().should('include', '/sessions/create');
            cy.get('h1').should('contain', 'Create session');
        
            cy.get('input[formControlName="name"]').type('New Yoga Session');
            cy.get('input[formControlName="date"]').type('2023-06-15');
            cy.get('mat-select[formControlName="teacher_id"]').click();
            cy.get('mat-option').first().click();
            cy.get('textarea[formControlName="description"]').type('Relaxing yoga session');
        
            cy.get('button[type="submit"]').click();
        
        
            cy.url().should('include', '/sessions');

        });
        

        it('Should display edit button', () => {
            cy.get('.items .item').each(($session) => {
                cy.wrap($session).find('[data-test-id^="edit-session-"]').should('be.visible');
            });
        });

        describe('Detail session',() => {
            it('Should display session details when clicking on Detail button', () => {
                cy.get('.items .item').each(($session) => {
                    cy.wrap($session).find('button').contains('Detail').should('be.visible');
                });
                cy.intercept('GET','/api/session/1', {
                    body:mockSessionsResponse[0]
                });
                cy.get('.items .item').first().within(() => {
                    cy.get('button').contains('Detail').click();
                });
            
                cy.url().should('include', '/sessions/detail/1');
            
                cy.get('h1').should('contain', 'Session1');
                cy.get('.description').should('contain', 'description');
            
            });

            it('Should remove session when click on delete', () => {
                cy.intercept('DELETE','/api/session/1', {
                    body:mockSessionsResponse[0]
                });
                cy.intercept('GET','/api/session/1', {
                    body:mockSessionsResponse[0]
                });
                cy.get('.items .item').first().within(() => {
                    cy.get('button').contains('Detail').click();
                });
            
                cy.url().should('include', '/sessions/detail/1');
            
                cy.get('[data-test-id="delete-session-button"]').should('be.visible').click();

                cy.url().should('include', '/sessions')

            });
        })
      
    })
    describe('Basic user',() => {
        beforeEach(() => {
            cy.visit('/login')
  
            cy.intercept('POST', '/api/auth/login', {
              body: user,
            })
            cy.intercept('GET','/api/session', {
              body:mockSessionsResponse
            });
        
        
            cy.get('input[formControlName=email]').type("yoga@studio.com")
            cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        
            cy.url().should('include', '/sessions')
        });
        
        it('Should display two sessions', () => {
            cy.get('.items .item').should('have.length', 2);

            cy.get('.items .item').first().find('mat-card-title').should('contain', 'session1');
            cy.get('.items .item').last().find('mat-card-title').should('contain', 'session2');
        });

        it('Should not display Create and edit buttons', () => {
            cy.get('[data-test-id="create-session-button"]').should('not.exist');

            cy.get('.items .item').each(($session) => {
                cy.wrap($session).find('[data-test-id^="edit-session-"]').should('not.exist');
            });
        });
        it('Should display details button', () => {
            cy.get('.items .item').each(($session) => {
                cy.wrap($session).find('button').contains('Detail').should('be.visible');
            });
        });
    })
    
});


// /// <reference types="cypress" />

// describe('Auth Flow', () => {
//     it('Registro y Login', () => {
//       cy.visit('/')
      
//       // Registro
//       cy.get('[data-testid="register-button"]').click()
//       cy.get('[data-testid="username-input"]').type('testuser')
//       cy.get('[data-testid="email-input"]').type('test@example.com')
//       cy.get('[data-testid="password-input"]').type('password123')
//       cy.get('[data-testid="register-submit"]').click()
      
//       // Login
//       //cy.get('[data-testid="login-button"]').click()
//       cy.get('[data-testid="email-input"]').type('test@example.com')
//       cy.get('[data-testid="password-input"]').type('password123')
//       cy.get('[data-testid="login-submit"]').click()
      
//       // Verificar dashboard
//       cy.get('[data-testid="welcome-message"]').should('contain', 'testuser')
//     })
//   })

/// <reference types="cypress" />

describe('Flujo de autenticación: login erróneo, registro y login correcto', () => {
  it('intenta loguearse con datos erróneos, se registra y luego se loguea correctamente', () => {
    // Visita la HomePage
    cy.visit('/');

    // 1. Desde HomePage, navega a la página de Login haciendo clic en el botón "Iniciar Sesión"
    cy.get('[data-testid="login-button"]').click();

    // Espera a que se muestre el formulario de login
    cy.get('[data-testid="login-form"]').should('be.visible');

    // 2. Intenta loguearse con datos erróneos
    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-submit"]').click();

    // Verifica que se muestre el mensaje de error (por ejemplo, "No existe una cuenta...")
    cy.get('[data-testid="error-message"]').should('contain', 'No existe una cuenta');

    // 3. Navega a la página de registro usando el enlace "Regístrate"
    cy.get('[data-testid="register-link"]').click();

    // Espera a que se muestre el formulario de registro
    cy.get('[data-testid="register-form"]').should('be.visible');

    // 4. Completa el formulario de registro con los mismos datos (más un nombre de usuario)
    cy.get('[data-testid="username-input"]').type('wrongUser');
    cy.get('[data-testid="email-input"]').clear().type('wrong@example.com');
    cy.get('[data-testid="password-input"]').clear().type('wrongpassword');
    cy.get('[data-testid="register-submit"]').click();

    // En lugar de esperar un mensaje de éxito (que no da chance de aparecer),
    // forzamos la navegación a la página de login
    cy.visit('/login');

    // 5. Llena el formulario de login con los datos recién registrados
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('[data-testid="email-input"]').clear().type('wrong@example.com');
    cy.get('[data-testid="password-input"]').clear().type('wrongpassword');
    cy.get('[data-testid="login-submit"]').click();

    // 6. Verifica que en el dashboard se muestre el mensaje de bienvenida con el nombre registrado
    cy.get('[data-testid="welcome-message"]').should('contain', 'wrongUser');
  });
});

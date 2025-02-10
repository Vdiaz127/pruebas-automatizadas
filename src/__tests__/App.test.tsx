// import {  it, expect,  } from 'vitest';
// import '@testing-library/jest-dom';
// import { render, screen, fireEvent } from '@testing-library/react';
// // import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from '../hooks/useAuth';
// import App from '../App';

// // Modificar la función renderWithRouter para usar MemoryRouter
// import { MemoryRouter } from 'react-router-dom';

// const renderWithRouter = (ui: React.ReactElement, initialEntries: string[] = ['/']) => {
//   return render(
//     <MemoryRouter initialEntries={initialEntries}>
//       <AuthProvider>
//         {ui}
//       </AuthProvider>
//     </MemoryRouter>
//   );
// };
// console.log("test de vitest");
// // Corregir la prueba 'renders home page with navigation links'
// it('renders home page with navigation links', () => {
//   renderWithRouter(<App />);
//   expect(screen.getByText(/Bienvenido a nuestra aplicación/i)).toBeInTheDocument();
//   // Usar data-testid en lugar de texto
//   expect(screen.getByTestId('register-button')).toBeInTheDocument();
//   expect(screen.getByTestId('login-button')).toBeInTheDocument();
// });

// // Corregir la prueba 'allows user login and shows dashboard'
// it('allows user login and shows dashboard', async () => {
//   // Configurar usuario de prueba
//   localStorage.setItem('users', JSON.stringify([{
//     username: 'testuser',
//     email: 'test@example.com',
//     password: 'password123'
//   }]));
  
//   renderWithRouter(<App />);
  
//   // Navegar a la página de login usando el botón en HomePage
//   fireEvent.click(screen.getByTestId('login-button'));
  
//   // Esperar a que el formulario de login esté presente
//   await screen.findByTestId('login-form');
  
//   // Rellenar formulario
//   fireEvent.change(screen.getByTestId('email-input'), {
//     target: { value: 'test@example.com' },
//   });
//   fireEvent.change(screen.getByTestId('password-input'), {
//     target: { value: 'password123' },
//   });
  
//   // Enviar formulario
//   fireEvent.submit(screen.getByTestId('login-form'));
  
//   // Verificar redirección al dashboard
//   expect(await screen.findByTestId('welcome-message')).toHaveTextContent('Bienvenido, testuser!');
// });

// src/__tests__/App.test.tsx
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import App from '../App';

// Helper para renderizar la app con MemoryRouter y AuthProvider
const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
};

describe('Flujo de autenticación: intento de login erróneo, registro y login correcto', () => {
  // Limpia el localStorage antes de cada test para evitar contaminación entre pruebas
  beforeEach(() => {
    localStorage.clear();
  });

  it('intenta loguearse con datos erróneos, luego se registra y finalmente logra loguearse', async () => {
    // Renderiza la App desde la HomePage
    renderWithRouter(<App />);

    // 1. Desde HomePage, navega a Login haciendo clic en el botón "Iniciar Sesión"
    fireEvent.click(screen.getByTestId('login-button'));

    // Espera a que aparezca el formulario de login
    await screen.findByTestId('login-form');

    // 2. Intenta loguearse con datos erróneos
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpassword' } });
    fireEvent.submit(screen.getByTestId('login-form'));

    // Verifica que se muestre un mensaje de error (por ejemplo, "No existe una cuenta con este correo electrónico")
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(/No existe una cuenta/i);
    });

    // 3. Desde la página de login, haz clic en el enlace "Regístrate"
    fireEvent.click(screen.getByTestId('register-link'));

    // Espera a que aparezca el formulario de registro
    await screen.findByTestId('register-form');

    // 4. Completa el formulario de registro con los mismos datos (más un nombre de usuario)
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'wrongUser' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpassword' } });
    fireEvent.submit(screen.getByTestId('register-form'));

    // Espera a que aparezca el mensaje de éxito de registro
    // await waitFor(() => {
    //   expect(screen.getByTestId('success-message')).toHaveTextContent(/Registro exitoso/i);
    // });

    // 5. Desde la pantalla de registro, haz clic en el enlace "Inicia sesión" para volver al login  
    // (el enlace en el formulario de registro utiliza data-testid="login-button")
    //fireEvent.click(screen.getByTestId('login-button'));

    // Espera a que vuelva a aparecer el formulario de login
    await screen.findByTestId('login-form');

    // Rellena el formulario de login con los datos recién registrados
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpassword' } });
    fireEvent.submit(screen.getByTestId('login-form'));

    // Verifica que en el dashboard se muestre el mensaje de bienvenida con el nombre registrado
    await waitFor(() => {
      expect(screen.getByTestId('welcome-message')).toHaveTextContent(/Bienvenido, wrongUser!/i);
    });
  });
});

const { Builder, By, until } = require('selenium-webdriver');

describe('Pruebas de autenticación con Selenium', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('MicrosoftEdge').build();
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test('intento de login erróneo, registro y login correcto', async () => {
    console.log("Iniciando prueba Selenium...");

    // Visita la página principal
    await driver.get('http://localhost:5173');
    console.log("Página cargada.");

    // 1. Navegar a la página de Login (clic en el botón de login)
    await driver.findElement(By.css('[data-testid="login-button"]')).click();
    await driver.wait(until.elementLocated(By.css('[data-testid="login-form"]')), 10000);
    
    // 2. Intento de login con datos erróneos
    await driver.findElement(By.css('[data-testid="email-input"]')).sendKeys('wrong@example.com');
    await driver.findElement(By.css('[data-testid="password-input"]')).sendKeys('wrongpassword');
    await driver.findElement(By.css('[data-testid="login-submit"]')).click();
    console.log("Intento de login erróneo enviado.");

    // Espera y verifica que aparezca el mensaje de error
    await driver.wait(until.elementLocated(By.css('[data-testid="error-message"]')), 10000);
    const errorMsg = await driver.findElement(By.css('[data-testid="error-message"]')).getText();
    if (!errorMsg.includes("No existe una cuenta")) {
      throw new Error("El mensaje de error no coincide");
    }
    console.log("Error de login verificado.");

    // 3. Navegar a la página de registro usando el enlace "Regístrate"
    await driver.findElement(By.css('[data-testid="register-link"]')).click();
    console.log("Navegando a registro.");
    await driver.wait(until.elementLocated(By.css('[data-testid="register-form"]')), 10000);

    // 4. Completar el formulario de registro
    await driver.findElement(By.css('[data-testid="username-input"]')).sendKeys('wrongUser');
    const emailInput = await driver.findElement(By.css('[data-testid="email-input"]'));
    await emailInput.clear();
    await emailInput.sendKeys('wrong@example.com');
    const passwordInput = await driver.findElement(By.css('[data-testid="password-input"]'));
    await passwordInput.clear();
    await passwordInput.sendKeys('wrongpassword');
    await driver.findElement(By.css('[data-testid="register-submit"]')).click();
    console.log("Formulario de registro enviado.");

    // Dado que la aplicación cambia de página muy rápido, forzamos la navegación al login
    await driver.get('http://localhost:5173/login');
    await driver.wait(until.elementLocated(By.css('[data-testid="login-form"]')), 10000);

    // 5. Completar el formulario de login con los datos recién registrados
    const loginEmail = await driver.findElement(By.css('[data-testid="email-input"]'));
    await loginEmail.clear();
    await loginEmail.sendKeys('wrong@example.com');
    const loginPassword = await driver.findElement(By.css('[data-testid="password-input"]'));
    await loginPassword.clear();
    await loginPassword.sendKeys('wrongpassword');
    await driver.findElement(By.css('[data-testid="login-submit"]')).click();
    console.log("Formulario de login enviado con datos registrados.");

    // 6. Verificar que en el dashboard se muestre el mensaje de bienvenida
    const welcomeMessage = await driver.wait(
      until.elementLocated(By.css('[data-testid="welcome-message"]')),
      10000
    );
    const welcomeText = await welcomeMessage.getText();
    expect(welcomeText).toContain('wrongUser');
    console.log("Dashboard verificado, prueba exitosa.");
  }, 30000);
});

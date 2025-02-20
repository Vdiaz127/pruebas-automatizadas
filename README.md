
# Vite React TypeScript Starter – Testing con Bolt

Este proyecto es un starter basado en Vite, React y TypeScript, diseñado para realizar pruebas automatizadas. En este entorno se realizan pruebas de:

- **Pruebas unitarias e integración** con **Vitest**
- **Pruebas end-to-end (E2E)** con **Cypress**
- **Pruebas E2E en un navegador real** con **Selenium** (ejecutado mediante Jest)

La ejecución de estas pruebas se realiza a través de [Bolt](https://bolt.new/), lo que permite automatizar y desplegar rápidamente el flujo de testing en un entorno dedicado.

---

## Instalación

### Clona el repositorio:

   `git clone <URL_DEL_REPOSITORIO>`

### Instala las dependencias:


Utiliza npm o yarn según tu preferencia:

```
npm install
# o
yarn install
```

### Scripts de Testing
El proyecto cuenta con los siguientes scripts definidos en el package.json para ejecutar distintos modos de testing:

**Desarrollo y pruebas unitarias/integración (Vitest)**

```npm run test```

Ejecuta las pruebas unitarias y de integración con Vitest.

**Pruebas E2E con Cypress:**

```
npm run test:cypress
```
Abre la interfaz de Cypress para realizar pruebas end-to-end basadas en la interacción visual.

**Pruebas E2E con Selenium:**

```
npm run test:selenium
```

Ejecuta el script de Selenium (utilizando Jest) que automatiza el flujo de autenticación en un navegador real (por ejemplo, Microsoft Edge).

**Ejecución de todos los tests:**

```
npm run test:all
```
Este comando ejecuta secuencialmente:

- Las pruebas unitarias/integración con Vitest.

- Las pruebas E2E con Cypress.

- Las pruebas E2E con Selenium.

### Descripción del Proceso de Testing
El entorno de testing automatizado se centra en validar el flujo de autenticación de la aplicación:

**Inicio y Navegación:**

La aplicación muestra una página de bienvenida con opciones para registrarse o iniciar sesión.

**Intento de Login Erróneo:**

Se intenta iniciar sesión con datos incorrectos, lo que debe producir un mensaje de error.

**Registro y Login Exitoso:**

Desde la pantalla de login, se navega al formulario de registro.

Se completan los datos (usando los mismos datos del intento fallido, con un nombre de usuario añadido).

Posteriormente, se vuelve a la pantalla de login para iniciar sesión correctamente y acceder al dashboard.

El flujo de pruebas ha sido automatizado mediante scripts que interactúan directamente con la interfaz de usuario, replicando el comportamiento real de un usuario.

*Notas*
Este proyecto y su flujo de testing fueron configurados y ejecutados usando Bolt.


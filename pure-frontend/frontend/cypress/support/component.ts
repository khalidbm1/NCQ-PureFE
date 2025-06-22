// ***********************************************************
// This file is processed and loaded automatically before component test files.
// ***********************************************************

// Import commands.js
import './commands';

// Import styles
import '../../apps/main/src/styles/globals.css';

// Import component testing utilities
import { mount } from 'cypress/react18';

// Augment the Cypress namespace to include type definitions
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
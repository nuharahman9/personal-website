import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest runs without globals, so RTL's auto-cleanup isn't registered.
afterEach(cleanup);

// jsdom doesn't implement layout-dependent scrolling APIs.
Element.prototype.scrollIntoView ??= () => {};
Element.prototype.scrollTo ??= () => {};

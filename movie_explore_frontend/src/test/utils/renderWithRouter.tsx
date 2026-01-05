import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';

interface RenderWithRouterOptions extends RenderOptions {
  route?: string;
  path?: string;
}

/**
 * Renders a component with BrowserRouter wrapper for basic routing
 */
export function renderWithRouter(ui: ReactElement, options?: RenderOptions) {
  return render(ui, {
    wrapper: BrowserRouter,
    ...options,
  });
}

/**
 * Renders a component with MemoryRouter for testing specific routes
 */
export function renderWithMemoryRouter(
  ui: ReactElement,
  { route = '/', path = '/', ...options }: RenderWithRouterOptions = {}
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>,
    options
  );
}

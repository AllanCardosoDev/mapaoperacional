import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App';

describe('App Component', () => {
  it('renders main title', () => {
    render(<App />);
    const title = screen.getByText(/MAPA OPERACIONAL/i);
    expect(title).toBeTruthy();
  });
});

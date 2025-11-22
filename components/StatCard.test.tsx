import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { StatCard } from './StatCard';
import { Hash } from 'lucide-react';
import React from 'react';

describe('StatCard Component', () => {
  // Clean up the DOM after each test to ensure isolation
  afterEach(() => {
    cleanup();
  });

  it('renders title and value correctly', () => {
    render(<StatCard title="Test Title" value="123" icon={Hash} />);
    
    // Check if title exists
    expect(screen.getByText('Test Title')).toBeDefined();
    // Check if value exists
    expect(screen.getByText('123')).toBeDefined();
  });

  it('renders rich subtext (JSX) correctly', () => {
    // This tests the feature where we show "Total Characters" as a bold sub-label
    render(
        <StatCard
            title="Char Count"
            value={10}
            icon={Hash}
            subtext={<span>Total: <strong>100</strong></span>}
        />
    );

    // Verify the subtext part is rendered
    expect(screen.getByText('Total:')).toBeDefined();
    // Verify the bold number is rendered
    expect(screen.getByText('100')).toBeDefined();
  });
});
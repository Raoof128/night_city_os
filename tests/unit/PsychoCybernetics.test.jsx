import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PsychoCybernetics from '../../src/apps/components/psycho/PsychoCybernetics';

// Mock dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('PsychoCybernetics Module', () => {
    it('renders the main dashboard', () => {
        render(<PsychoCybernetics />);
        expect(screen.getByText('PSYCHO_CYBERNETICS')).toBeInTheDocument();
        expect(screen.getByText('SYSTEM MESSAGE')).toBeInTheDocument();
    });

    it('renders sub-components', () => {
        render(<PsychoCybernetics />);
        expect(screen.getByText('TEMPORAL_BURN_CYCLES')).toBeInTheDocument(); // Heatmap
        expect(screen.getByText('IMPULSE_ICE')).toBeInTheDocument(); // Impulse ICE
        expect(screen.getByText('DOPAMINE_LOG')).toBeInTheDocument(); // Loot Log
        expect(screen.getByText('THE_FIXER_NETWORK')).toBeInTheDocument(); // Street Cred
    });

    it('displays spending advice', () => {
         render(<PsychoCybernetics />);
         expect(screen.getByText(/PATTERN:/i)).toBeInTheDocument();
         expect(screen.getByText(/ADVICE:/i)).toBeInTheDocument();
    });
});

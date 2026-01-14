import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { BrowserRouter } from 'react-router-dom';

describe('Button Component', () => {
    it('renders children correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders loading spinner when isLoading is true', () => {
        render(<Button isLoading>Click Me</Button>);
        // Check for the SVG that represents the spinner
        const spinner = screen.getByRole('button').querySelector('svg');
        expect(spinner).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('handles onClick events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onClick when disabled', () => {
        const handleClick = vi.fn();
        render(<Button disabled onClick={handleClick}>Click Me</Button>);
        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('renders as a Link when "to" prop is present', () => {
        render(
            <BrowserRouter>
                <Button to="/dashboard">Go to Dashboard</Button>
            </BrowserRouter>
        );
        const link = screen.getByRole('link', { name: /go to dashboard/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('applies variant classes correctly', () => {
        const { rerender } = render(<Button variant="danger">Delete</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-red-600');

        rerender(<Button variant="outline">Back</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-transparent', 'border-blue-600');
    });
});

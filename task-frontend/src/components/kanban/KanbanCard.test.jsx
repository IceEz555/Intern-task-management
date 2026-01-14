import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanCard from './KanbanCard';

// Mock @dnd-kit/sortable because it requires Context
vi.mock('@dnd-kit/sortable', () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false,
    }),
}));

vi.mock('@dnd-kit/utilities', () => ({
    CSS: {
        Transform: {
            toString: () => '',
        },
    },
}));

describe('KanbanCard Component', () => {
    const mockTask = {
        id: 'task-1',
        title: 'Fix Login Bug',
        priority: 'High',
        assignee: 'John Doe',
        due_date: '2023-12-31',
    };

    const mockOnClick = vi.fn();

    it('renders task details correctly', () => {
        render(<KanbanCard id={mockTask.id} task={mockTask} onClick={mockOnClick} />);

        expect(screen.getByText('Fix Login Bug')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
        // Check for initials
        expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('applies correct priority color', () => {
        const lowPriorityTask = { ...mockTask, priority: 'Low' };
        const { rerender } = render(<KanbanCard id="1" task={lowPriorityTask} onClick={mockOnClick} />);
        
        expect(screen.getByText('Low')).toHaveClass('bg-green-50');

        const highPriorityTask = { ...mockTask, priority: 'High' };
        rerender(<KanbanCard id="1" task={highPriorityTask} onClick={mockOnClick} />);
        expect(screen.getByText('High')).toHaveClass('bg-red-50');
    });

    it('calls onClick when clicked', () => {
        render(<KanbanCard id={mockTask.id} task={mockTask} onClick={mockOnClick} />);
        
        // Find the clickable container (the outer div usually has the onClick in this component)
        // Since we spread ...attributes and ...listeners, finding by text and clicking parent is easiest
        const cardTitle = screen.getByText('Fix Login Bug');
        fireEvent.click(cardTitle);

        expect(mockOnClick).toHaveBeenCalledWith(mockTask);
    });

    it('handles missing assignee gracefully', () => {
        const noAssigneeTask = { ...mockTask, assignee: null };
        render(<KanbanCard id="1" task={noAssigneeTask} onClick={mockOnClick} />);
        
        // Should default to 'U'
        expect(screen.getByText('U')).toBeInTheDocument();
    });
});

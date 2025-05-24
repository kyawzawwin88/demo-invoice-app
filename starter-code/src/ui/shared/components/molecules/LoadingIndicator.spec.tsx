import { render, screen } from '@testing-library/react';
import { LoadingIndicator } from './LoadingIndicator';

describe('LoadingIndicator', () => {
  it('should render loading text', () => {
    render(<LoadingIndicator />);
    expect(screen.getByText('Loading.......')).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<LoadingIndicator />);
    const loadingDiv = container.firstChild as HTMLElement;
    expect(loadingDiv).toHaveClass('text-center', 'py-4');
  });
});

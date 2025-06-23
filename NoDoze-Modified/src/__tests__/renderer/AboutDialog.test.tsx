const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const AboutDialog = require('../../renderer/AboutDialog').default;

describe('AboutDialog Component', () => {
  it('should not render when isOpen is false', () => {
    render(<AboutDialog isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('About NoDoze')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<AboutDialog isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('About NoDoze')).toBeInTheDocument();
    expect(screen.getByText('Version')).toBeInTheDocument();
    expect(screen.getByText('NoDoze v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText(/prevent system sleep with one click/i)).toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', () => {
    const onCloseMock = jest.fn();
    render(<AboutDialog isOpen={true} onClose={onCloseMock} />);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
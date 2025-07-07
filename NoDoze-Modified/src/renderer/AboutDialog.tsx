import React from 'react';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="about-dialog-overlay">
      <div className="about-dialog">
        <div className="about-header">
          <h2>About NoDoze</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="about-content">
          <div className="about-section">
            <h3>Version</h3>
            <p>NoDoze v1.0.0</p>
          </div>
          
          <div className="about-section">
            <h3>Description</h3>
            <p>NoDoze is a lightweight application that prevents your computer from going to sleep. 
            It works by using platform-specific APIs to keep your system awake without affecting other power management settings.</p>
          </div>
          
          <div className="about-section">
            <h3>Features</h3>
            <ul>
              <li>Prevent system sleep with one click</li>
              <li>Timer mode for scheduled sleep prevention</li>
              <li>Runs in system tray for easy access</li>
              <li>Supports Windows, macOS, and Linux</li>
            </ul>
          </div>
        </div>
        
        <div className="about-footer">
          <p>© 2025 NoDoze Team</p>
        </div>
      </div>
    </div>
  );
};

export default AboutDialog;
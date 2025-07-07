import React from 'react';
import { ipcRenderer } from 'electron';

interface TitleBarProps {
  title: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ title }) => {
  const handleMinimize = () => {
    ipcRenderer.send('window-minimize');
  };

  const handleCorner = () => {
    ipcRenderer.send('window-corner');
  };

  const handleClose = () => {
    ipcRenderer.send('window-close');
  };

  return (
    <div className="title-bar">
      <div className="title-bar-drag-area">
        <div className="title-bar-title">{title}</div>
      </div>
      <div className="title-bar-controls">        <button 
          className="title-bar-button title-bar-minimize" 
          onClick={handleMinimize}
          aria-label="Minimize"
        >
          <svg width="16" height="1" viewBox="0 0 10 1">
            <path d="M0 0h10v1H0z" fill="currentColor" />
          </svg>
        </button>        <button 
          className="title-bar-button title-bar-corner" 
          onClick={handleCorner}
          aria-label="Move to Corner"
        >          <svg width="16" height="16" viewBox="0 0 10 10">
            <rect x="0.5" y="0.5" width="9" height="5.5" stroke="currentColor" fill="none" strokeWidth="1"/>
            <circle cx="8.5" cy="5" r="1.5" fill="currentColor" />
          </svg>
        </button>
        <button 
          className="title-bar-button title-bar-close" 
          onClick={handleClose}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 10 10">
            <path d="M1.41 0L0 1.41 3.59 5 0 8.59 1.41 10 5 6.41 8.59 10 10 8.59 6.41 5 10 1.41 8.59 0 5 3.59 1.41 0z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TitleBar;

import React from 'react';
import './ToggleButton.css';

interface ToggleButtonProps {
  checked: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ checked, onToggle }) => {

  return (
    <div className="c-toggle-btn">
      <input type="checkbox" checked={checked} onChange={(e) => {onToggle(e.target.checked)}}/>
      <label ></label>
    </div>
  );
};

export default ToggleButton;

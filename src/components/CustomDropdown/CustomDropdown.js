import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ 
  options = [], 
  placeholder = "Select or type...", 
  value = "", 
  onChange,
  onSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selectedValue, setSelectedValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    // Filter options based on input value
    // If input is empty, show all options
    if (inputValue === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [inputValue, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    
    // Only call onChange if the value matches one of the options
    const matchingOption = options.find(option => 
      option.toLowerCase() === newValue.toLowerCase()
    );
    if (matchingOption) {
      if (onChange) onChange(matchingOption);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedValue(option);
    setInputValue(''); // Clear input after selection
    setIsOpen(false);
    if (onSelect) onSelect(option);
    if (onChange) onChange(option);
  };

  const handleInputClick = () => {
    if (!isOpen) {
      // When opening dropdown, clear input and show all options
      setInputValue('');
      setFilteredOptions(options);
      setIsOpen(true);
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    } else {
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsOpen(false);
      // If there's an exact match, select it
      const exactMatch = options.find(option => 
        option.toLowerCase() === inputValue.toLowerCase()
      );
      if (exactMatch) {
        handleOptionSelect(exactMatch);
      } else if (filteredOptions.length === 1) {
        // If there's only one filtered option, select it
        handleOptionSelect(filteredOptions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      {/* Chip Display */}
      <div 
        className={`dropdown-chip ${isOpen ? 'open' : ''} ${!selectedValue ? 'placeholder' : ''}`}
        onClick={handleInputClick}
      >
        <span className="chip-text">
          {selectedValue || placeholder}
        </span>
      </div>
      
      {/* Dropdown Panel */}
      {isOpen && (
        <div className="dropdown-panel">
          <div className="dropdown-input-container">
            <input
              ref={inputRef}
              type="text"
              className="dropdown-input"
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="dropdown-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`dropdown-option ${selectedValue === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="dropdown-option no-options">
                No matching options
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

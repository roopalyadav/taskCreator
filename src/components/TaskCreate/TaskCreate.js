import React, { useEffect, useRef, useState } from 'react';
import './TaskCreate.css';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';
import Milestone from '../Milestone/Milestone';

const TaskCreate = ({ onClose }) => {
  const inputRef = useRef(null);
  const secondInputRef = useRef(null);
  const [formData, setFormData] = useState({
    projectName: { value: '', showText: false },
    description: { value: '', showText: false },
    summary: { value: '', showText: false },
    milestone: {
      title: { value: '', showText: false },
      description: { value: '', showText: false },
      date: null
    },
    priority: 'Medium',
    ticketStatus: 'Backlog',
    dueDate: null,
    startDate: null
  });

  const priorityOptions = [
    'No Priority',
    'Urgent', 
    'High',
    'Medium',
    'Low'
  ];

  const ticketStatusOptions = [
    'Backlog',
    'Planned',
    'In Progress',
    'Completed',
    'Cancelled'
  ];


  useEffect(() => {
    // Focus the first input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Focus inputs only when switching from text back to input mode for each field individually
  useEffect(() => {
    if (inputRef.current && !formData.projectName.showText && formData.projectName.value) {
      inputRef.current.focus();
    }
  }, [formData.projectName.showText]);

  useEffect(() => {
    if (secondInputRef.current && !formData.description.showText && formData.description.value) {
      secondInputRef.current.focus();
    }
  }, [formData.description.showText]);

  const handleFormChange = (field, type) => (e) => {
    const updates = {
      input: () => {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return { [parent]: { ...formData[parent], [child]: { ...formData[parent][child], value: e.target.value } } };
        }
        return { [field]: { ...formData[field], value: e.target.value } };
      },
      keypress: () => {
        if (e.key === 'Enter') {
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            return { [parent]: { ...formData[parent], [child]: { ...formData[parent][child], showText: true } } };
          }
          return { [field]: { ...formData[field], showText: true } };
        }
        return {};
      },
      textclick: () => {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return { [parent]: { ...formData[parent], [child]: { ...formData[parent][child], showText: false } } };
        }
        return { [field]: { ...formData[field], showText: false } };
      },
      dropdown: () => ({ [field]: e }),
      date: () => {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return { [parent]: { ...formData[parent], [child]: e } };
        }
        return { [field]: e };
      }
    };
    
    const update = updates[type]?.();
    if (update && Object.keys(update).length) {
      setFormData(prev => ({ ...prev, ...update }));
    }
  };

  const handleMilestoneCancel = () => {
    // Don't reset milestone data on cancel - keep existing data
    // Only reset if there's no existing milestone data
    const hasExistingData = formData.milestone.title?.value || formData.milestone.description?.value || formData.milestone.date;
    if (!hasExistingData) {
      setFormData(prev => ({
        ...prev,
        milestone: {
          title: { value: '', showText: false },
          description: { value: '', showText: false },
          date: null
        }
      }));
    }
  };

  const handleMilestoneCreate = () => {
    console.log('Creating milestone:', formData.milestone);
    // Handle milestone creation logic here
  };

  // Check if all required fields have data
  const isFormValid = () => {
    return (
      formData.projectName.value?.trim() &&
      formData.startDate &&
      formData.dueDate
    );
  };

  return (
    <div className="task-create">
      <div>
        {!formData.projectName.showText ? (
          <input
            ref={inputRef}
            type="text"
            className="invisible-input"
            placeholder="Project name"
            value={formData.projectName.value}
            onChange={handleFormChange('projectName', 'input')}
            onKeyPress={handleFormChange('projectName', 'keypress')}
          />
        ) : (
          <div className="entered-text" onClick={handleFormChange('projectName', 'textclick')}>
            {formData.projectName.value}
          </div>
        )}
        
        {!formData.description.showText ? (
          <input
            ref={secondInputRef}
            type="text"
            className="invisible-input-small"
            placeholder="Add a short summary..."
            value={formData.description.value}
            onChange={handleFormChange('description', 'input')}
            onKeyPress={handleFormChange('description', 'keypress')}
          />
        ) : (
          <div className="entered-text entered-text-small" onClick={handleFormChange('description', 'textclick')}>
            {formData.description.value}
          </div>
        )}

        <CustomDropdown
          options={ticketStatusOptions}
          placeholder="Change Status..."
          value={formData.ticketStatus}
          onChange={handleFormChange('ticketStatus', 'dropdown')}
        />

        <CustomDropdown
          options={priorityOptions}
          placeholder="Select priority level..."
          value={formData.priority}
          onChange={handleFormChange('priority', 'dropdown')}
        />

        <CustomDatePicker
          value={formData.startDate}
          onChange={handleFormChange('startDate', 'date')}
          placeholder="Start"
        />

        <CustomDatePicker
          value={formData.dueDate}
          onChange={handleFormChange('dueDate', 'date')}
          placeholder="Target"
        />

        {/* Separation line */}
        <div className="separator-line"></div>

        {/* Summary input field */}
        {!formData.summary?.showText ? (
          <textarea
            className="invisible-textarea"
            placeholder="Write a description, or project brief or collect ideas..."
            value={formData.summary?.value || ''}
            onChange={handleFormChange('summary', 'input')}
            onKeyPress={handleFormChange('summary', 'keypress')}
          />
        ) : (
          <div className="entered-text-summary" onClick={handleFormChange('summary', 'textclick')}>
            {formData.summary.value}
          </div>
        )}

      </div>

      {/* Milestone section */}
      <Milestone 
        milestoneData={formData.milestone}
        onChange={(field, type) => handleFormChange(`milestone.${field}`, type)}
        onCancel={handleMilestoneCancel}
        onCreate={handleMilestoneCreate}
      />

      <div className="modal-actions">
        <div onClick={onClose} className="modal-action-button cancel-button">
          Cancel
        </div>
        <div 
          className={`modal-action-button create-button ${!isFormValid() ? 'disabled' : ''}`}
          onClick={isFormValid() ? () => console.log('Creating project...') : undefined}
        >
          Create Project
        </div>
      </div>
    </div>
  );
};

export default TaskCreate;

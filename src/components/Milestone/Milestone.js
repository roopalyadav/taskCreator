import React, { useState } from 'react';
import './Milestone.css';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const Milestone = ({ milestoneData, onChange, onCancel, onCreate }) => {
  const [expanded, setExpanded] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const milestoneExists = milestoneData.title?.value || milestoneData.description?.value || milestoneData.date;
  const canCreateMilestone = milestoneData.title?.value?.trim();
  
  const handleToggle = () => setExpanded(!expanded);
  const handleCancel = () => { setExpanded(false); onCancel(); };
  const handleCreate = () => { 
    if (canCreateMilestone) {
      onCreate(); 
      setExpanded(false); 
    }
  };

  const handleDateChange = (date) => {
    onChange('date', 'date')(date?.format('YYYY-MM-DD') || null);
  };

  const handleDateIconClick = (e) => {
    e.stopPropagation();
    setDatePickerOpen(true);
  };

  const renderInput = (field, placeholder, className = "invisible-input") => (
    !milestoneData[field]?.showText ? (
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        value={milestoneData[field]?.value || ''}
        onChange={onChange(field, 'input')}
        onKeyPress={onChange(field, 'keypress')}
      />
    ) : (
      <div className={className === "invisible-input" ? "entered-text" : "entered-text entered-text-small"} 
           onClick={onChange(field, 'textclick')}>
        {milestoneData[field].value}
      </div>
    )
  );

  return (
    <div className="milestone-section">
      {!expanded ? (
        <div className="milestone-collapsed" onClick={handleToggle}>
          {milestoneExists ? (
            <div className="milestone-data">
              <div className="milestone-title">{milestoneData.title?.value || 'Untitled Milestone'}</div>
              {milestoneData.description?.value && (
                <div className="milestone-description">{milestoneData.description.value}</div>
              )}
            </div>
          ) : (
            <span>Milestone</span>
          )}
          <span className="milestone-icon">{milestoneExists ? '✏️' : '+'}</span>
        </div>
      ) : (
        <div className="milestone-expanded">
          <h3 className="milestone-heading">Create Milestone</h3>
          <div className="milestone-separator"></div>
          <div className="milestone-input-with-date">
            {renderInput('title', 'Milestone title')}
            <div className="milestone-date-picker">
              <DatePicker
                value={milestoneData.date ? dayjs(milestoneData.date) : null}
                onChange={handleDateChange}
                open={datePickerOpen}
                onOpenChange={setDatePickerOpen}
                suffixIcon={null}
                placeholder=""
                className="milestone-date-input"
                allowClear={false}
              />
              {milestoneData.date ? (
                <div className="milestone-selected-date" onClick={handleDateIconClick}>
                  {typeof milestoneData.date === 'string' ? 
                    dayjs(milestoneData.date).format('MMM DD, YYYY') : 
                    milestoneData.date.format('MMM DD, YYYY')
                  }
                </div>
              ) : (
                <span className="milestone-date-icon" onClick={handleDateIconClick}>📅</span>
              )}
            </div>
          </div>
          {renderInput('description', 'Milestone description', 'invisible-input-small')}
          <div className="milestone-actions">
            <div onClick={handleCancel} className="milestone-action-button milestone-cancel-button">Cancel</div>
            <div 
              onClick={handleCreate} 
              className={`milestone-action-button milestone-create-button ${!canCreateMilestone ? 'disabled' : ''}`}
              disabled={!canCreateMilestone}
            >
              Create Milestone
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Milestone;

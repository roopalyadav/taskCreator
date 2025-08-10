import React, { useState, useEffect, useRef } from 'react';
import { DatePicker, Tabs, Popover } from 'antd';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import './CustomDatePicker.css';

dayjs.extend(quarterOfYear);

const CustomDatePicker = ({ value, onChange, placeholder = "Select date...", disabled = false }) => {
  const [activeTab, setActiveTab] = useState('date');
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value ? dayjs(value) : null);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (value) setSelectedValue(dayjs(value));
  }, [value]);

  const formatValue = (date) => {
    if (!date) return null;
    switch (activeTab) {
      case 'month': return date.startOf('month');
      case 'quarter': return date.startOf('quarter');
      case 'half-year': 
        const month = date.month();
        return dayjs().year(date.year()).month(month < 6 ? 0 : 6).startOf('month');
      case 'year': return date.startOf('year');
      default: return date;
    }
  };

  const formatDisplay = (date) => {
    if (!date) return '';
    switch (activeTab) {
      case 'month': return date.format('MMMM YYYY');
      case 'quarter': return `Q${date.quarter()} ${date.year()}`;
      case 'half-year': return date.month() < 6 ? `H1 ${date.year()}` : `H2 ${date.year()}`;
      case 'year': return date.format('YYYY');
      default: return date.format('YYYY-MM-DD');
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleDateChange = (date) => {
    const formattedValue = formatValue(date);
    setSelectedValue(formattedValue);
    if (onChange) onChange(formattedValue);
    setOpen(false);
  };

  const pickerProps = {
    value: selectedValue,
    onChange: handleDateChange,
    disabled,
    style: { width: '100%' },
    size: 'small'
  };

  const getPickerByTab = () => {
    const placeholders = {
      month: 'Select month',
      quarter: 'Select quarter',
      'half-year': 'Select half year',
      year: 'Select year',
      date: placeholder
    };

    const props = { ...pickerProps, placeholder: placeholders[activeTab] };

    switch (activeTab) {
      case 'month': return <DatePicker key="month" {...props} picker="month" />;
      case 'quarter': return <DatePicker key="quarter" {...props} picker="quarter" />;
      case 'year': return <DatePicker key="year" {...props} picker="year" />;
      case 'half-year': return <DatePicker key="half-year" {...props} picker="month" format={formatDisplay} />;
      default: return <DatePicker key="date" {...props} />;
    }
  };

  const tabs = [
    { label: 'Date', key: 'date' },
    { label: 'Month', key: 'month' },
    { label: 'Quarter', key: 'quarter' },
    { label: 'Half Yr', key: 'half-year' },
    { label: 'Year', key: 'year' }
  ];

  return (
    <div className="custom-datepicker" ref={popoverRef}>
      <Popover
        content={
          <div className="custom-datepicker-content">
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              size="small"
              className="datepicker-tabs"
              items={tabs}
            />
            <div className="datepicker-picker">
              {getPickerByTab()}
            </div>
          </div>
        }
        trigger="click"
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
        }}
        placement="bottomLeft"
        overlayClassName="custom-datepicker-popover"
        getPopupContainer={() => popoverRef.current || document.body}
      >
        <div className="datepicker-display" onClick={() => setOpen(!open)}>
          <span className="datepicker-value">
            {selectedValue ? formatDisplay(selectedValue) : placeholder}
          </span>
          {/* <span className="datepicker-icon">📅</span> */}
        </div>
      </Popover>
    </div>
  );
};

export default CustomDatePicker;

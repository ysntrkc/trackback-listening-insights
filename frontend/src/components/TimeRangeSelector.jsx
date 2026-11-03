import React from 'react';

const RANGES = [
  ['short_term', 'Last 4 Weeks'],
  ['medium_term', 'Last 6 Months'],
  ['long_term', 'All Time'],
];

const TimeRangeSelector = ({ value, onChange }) => (
  <div className="time-range-selector" role="group" aria-label="Time range">
    {RANGES.map(([range, label]) => (
      <button
        key={range}
        className={value === range ? 'active' : ''}
        aria-pressed={value === range}
        onClick={() => onChange(range)}
      >
        {label}
      </button>
    ))}
  </div>
);

export default TimeRangeSelector;

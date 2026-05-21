/**
 * Date Range Picker Component
 * TODO: Implement date range picker
 */

const DateRangePicker = ({ onDateChange }) => {
  return (
    <div className="date-range-picker">
      <input
        type="date"
        placeholder="From Date"
        onChange={(e) => onDateChange('from', e.target.value)}
      />
      <span>to</span>
      <input
        type="date"
        placeholder="To Date"
        onChange={(e) => onDateChange('to', e.target.value)}
      />
    </div>
  )
}

export default DateRangePicker


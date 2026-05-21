/**
 * Filter Panel Component
 * TODO: Implement filter panel with multiple filter options
 */

const FilterPanel = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-panel">
      {filters.map((filter) => (
        <div key={filter.name} className="filter-item">
          <label>{filter.label}</label>
          {filter.type === 'select' && (
            <select onChange={(e) => onFilterChange(filter.name, e.target.value)}>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {filter.type === 'date' && (
            <input
              type="date"
              onChange={(e) => onFilterChange(filter.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default FilterPanel


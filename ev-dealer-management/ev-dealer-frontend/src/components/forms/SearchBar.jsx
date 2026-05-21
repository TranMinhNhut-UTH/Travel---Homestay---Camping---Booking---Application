/**
 * Search Bar Component
 * TODO: Implement search with debounce
 */

import { useState } from 'react'

const SearchBar = ({ placeholder = 'Search...', onSearch }) => {
  const [query, setQuery] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    // TODO: Add debounce
    onSearch?.(value)
  }

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
    </div>
  )
}

export default SearchBar


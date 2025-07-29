import { useState, useEffect } from 'react'
import { EXPENSE_CATEGORIES } from '../../utils/expenseUtils'

const ExpenseFilter = ({ expenses, onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    sortBy: 'date',
    sortOrder: 'desc'
  })

  const [filteredExpenses, setFilteredExpenses] = useState(expenses)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    applyFilters()
  }, [expenses, filters])

  const applyFilters = () => {
    let filtered = [...expenses]

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(expense =>
        expense.title.toLowerCase().includes(searchTerm) ||
        expense.description?.toLowerCase().includes(searchTerm) ||
        expense.category.toLowerCase().includes(searchTerm)
      )
    }

    // Category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(expense => expense.category === filters.category)
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(expense => expense.date >= filters.dateFrom)
    }
    if (filters.dateTo) {
      filtered = filtered.filter(expense => expense.date <= filters.dateTo)
    }

    // Amount range filter
    if (filters.amountMin) {
      filtered = filtered.filter(expense => parseFloat(expense.amount) >= parseFloat(filters.amountMin))
    }
    if (filters.amountMax) {
      filtered = filtered.filter(expense => parseFloat(expense.amount) <= parseFloat(filters.amountMax))
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (filters.sortBy) {
        case 'date':
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case 'amount':
          aValue = parseFloat(a.amount)
          bValue = parseFloat(b.amount)
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        default:
          aValue = new Date(a.date)
          bValue = new Date(b.date)
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredExpenses(filtered)
    onFilterChange(filtered)
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      sortBy: 'date',
      sortOrder: 'desc'
    })
  }

  const getFilterSummary = () => {
    const activeFilters = []
    if (filters.search) activeFilters.push(`Search: "${filters.search}"`)
    if (filters.category !== 'All') activeFilters.push(`Category: ${filters.category}`)
    if (filters.dateFrom) activeFilters.push(`From: ${filters.dateFrom}`)
    if (filters.dateTo) activeFilters.push(`To: ${filters.dateTo}`)
    if (filters.amountMin) activeFilters.push(`Min: $${filters.amountMin}`)
    if (filters.amountMax) activeFilters.push(`Max: $${filters.amountMax}`)
    return activeFilters
  }

  const activeFilters = getFilterSummary()

  return (
    <div className="expense-filter">
      <div className="filter-header">
        <h3>Filter & Search Expenses</h3>
        <button
          className="btn btn-secondary"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      {/* Basic Search */}
      <div className="search-section">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search expenses by title, description, or category..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-field"
          />
        </div>
        
        <div className="quick-filters">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="title">Sort by Title</option>
            <option value="category">Sort by Category</option>
          </select>

          <button
            className="btn btn-small"
            onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Date From:</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label>Date To:</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Min Amount:</label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.amountMin}
                onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="filter-group">
              <label>Max Amount:</label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.amountMax}
                onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {activeFilters.length > 0 && (
        <div className="active-filters">
          <div className="filter-tags">
            {activeFilters.map((filter, index) => (
              <span key={index} className="filter-tag">
                {filter}
                <button
                  onClick={() => {
                    // Remove specific filter logic would go here
                    clearFilters()
                  }}
                  className="remove-filter"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button
            className="btn btn-secondary btn-small"
            onClick={clearFilters}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results Summary */}
      <div className="filter-results">
        <span className="results-count">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </span>
        {filteredExpenses.length !== expenses.length && (
          <span className="filtered-indicator">
            (Filtered)
          </span>
        )}
      </div>
    </div>
  )
}

export default ExpenseFilter 
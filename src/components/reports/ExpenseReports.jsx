import { useState } from 'react'
import { formatCurrency, formatDate } from '../../utils/expenseUtils'

const ExpenseReports = ({ expenses, stats }) => {
  const [reportType, setReportType] = useState('monthly')
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7))
  const [reportYear, setReportYear] = useState(new Date().getFullYear().toString())

  const exportToCSV = (data, filename) => {
    const csvContent = convertToCSV(data)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const convertToCSV = (data) => {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma
          const escaped = String(value).replace(/"/g, '""')
          return escaped.includes(',') ? `"${escaped}"` : escaped
        }).join(',')
      )
    ]
    
    return csvRows.join('\n')
  }

  const generateMonthlyReport = () => {
    const monthlyExpenses = expenses.filter(expense => 
      expense.date.startsWith(reportMonth)
    )
    
    const reportData = monthlyExpenses.map(expense => ({
      Date: formatDate(expense.date),
      Title: expense.title,
      Category: expense.category,
      Amount: formatCurrency(expense.amount),
      Description: expense.description || ''
    }))
    
    const monthName = new Date(reportMonth + '-01').toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
    
    exportToCSV(reportData, `expenses-${reportMonth}.csv`)
  }

  const generateYearlyReport = () => {
    const yearlyExpenses = expenses.filter(expense => 
      expense.date.startsWith(reportYear)
    )
    
    // Group by month
    const monthlyTotals = {}
    yearlyExpenses.forEach(expense => {
      const month = expense.date.slice(0, 7)
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = {
          total: 0,
          count: 0,
          categories: {}
        }
      }
      monthlyTotals[month].total += parseFloat(expense.amount)
      monthlyTotals[month].count += 1
      
      if (!monthlyTotals[month].categories[expense.category]) {
        monthlyTotals[month].categories[expense.category] = 0
      }
      monthlyTotals[month].categories[expense.category] += parseFloat(expense.amount)
    })
    
    const reportData = Object.entries(monthlyTotals).map(([month, data]) => ({
      Month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      'Total Spent': formatCurrency(data.total),
      'Number of Expenses': data.count,
      'Average per Expense': formatCurrency(data.total / data.count),
      'Top Category': Object.entries(data.categories)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
    }))
    
    exportToCSV(reportData, `expenses-${reportYear}-summary.csv`)
  }

  const generateCategoryReport = () => {
    const categoryData = Object.entries(stats.byCategory || {}).map(([category, amount]) => ({
      Category: category,
      'Total Spent': formatCurrency(amount),
      'Percentage': `${((amount / parseFloat(stats.total)) * 100).toFixed(1)}%`
    }))
    
    exportToCSV(categoryData, `expenses-by-category.csv`)
  }

  const generateDetailedReport = () => {
    const reportData = expenses.map(expense => ({
      Date: formatDate(expense.date),
      Title: expense.title,
      Category: expense.category,
      Amount: formatCurrency(expense.amount),
      Description: expense.description || '',
      'Created At': formatDate(expense.createdAt)
    }))
    
    exportToCSV(reportData, `all-expenses-detailed.csv`)
  }

  const getReportSummary = () => {
    switch (reportType) {
      case 'monthly':
        const monthlyExpenses = expenses.filter(expense => 
          expense.date.startsWith(reportMonth)
        )
        const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
        return {
          count: monthlyExpenses.length,
          total: monthlyTotal,
          month: new Date(reportMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        }
      case 'yearly':
        const yearlyExpenses = expenses.filter(expense => 
          expense.date.startsWith(reportYear)
        )
        const yearlyTotal = yearlyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
        return {
          count: yearlyExpenses.length,
          total: yearlyTotal,
          year: reportYear
        }
      default:
        return {
          count: expenses.length,
          total: parseFloat(stats.total),
          period: 'All Time'
        }
    }
  }

  const summary = getReportSummary()

  return (
    <div className="expense-reports">
      <div className="reports-header">
        <h3>Export & Reports</h3>
        <p>Generate and export expense reports in CSV format</p>
      </div>

      <div className="reports-grid">
        {/* Monthly Report */}
        <div className="report-card">
          <h4>Monthly Report</h4>
          <p>Export all expenses for a specific month</p>
          
          <div className="report-controls">
            <input
              type="month"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="report-input"
            />
            <button 
              className="btn btn-primary"
              onClick={generateMonthlyReport}
              disabled={summary.count === 0}
            >
              Export Monthly Report
            </button>
          </div>
          
          {reportType === 'monthly' && (
            <div className="report-summary">
              <span>{summary.count} expenses</span>
              <span>{formatCurrency(summary.total)} total</span>
            </div>
          )}
        </div>

        {/* Yearly Report */}
        <div className="report-card">
          <h4>Yearly Summary</h4>
          <p>Export monthly breakdown for a specific year</p>
          
          <div className="report-controls">
            <input
              type="number"
              value={reportYear}
              onChange={(e) => setReportYear(e.target.value)}
              min="2020"
              max="2030"
              className="report-input"
            />
            <button 
              className="btn btn-primary"
              onClick={generateYearlyReport}
            >
              Export Yearly Report
            </button>
          </div>
          
          {reportType === 'yearly' && (
            <div className="report-summary">
              <span>{summary.count} expenses</span>
              <span>{formatCurrency(summary.total)} total</span>
            </div>
          )}
        </div>

        {/* Category Report */}
        <div className="report-card">
          <h4>Category Breakdown</h4>
          <p>Export spending breakdown by category</p>
          
          <button 
            className="btn btn-primary"
            onClick={generateCategoryReport}
            disabled={Object.keys(stats.byCategory || {}).length === 0}
          >
            Export Category Report
          </button>
          
          <div className="report-summary">
            <span>{Object.keys(stats.byCategory || {}).length} categories</span>
            <span>{formatCurrency(parseFloat(stats.total))} total</span>
          </div>
        </div>

        {/* Detailed Report */}
        <div className="report-card">
          <h4>Complete Export</h4>
          <p>Export all expenses with full details</p>
          
          <button 
            className="btn btn-primary"
            onClick={generateDetailedReport}
            disabled={expenses.length === 0}
          >
            Export All Expenses
          </button>
          
          <div className="report-summary">
            <span>{expenses.length} expenses</span>
            <span>{formatCurrency(parseFloat(stats.total))} total</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="reports-stats">
        <h4>Quick Statistics</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-value">{expenses.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Spent</span>
            <span className="stat-value">{formatCurrency(parseFloat(stats.total))}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average per Expense</span>
            <span className="stat-value">
              {expenses.length > 0 ? formatCurrency(parseFloat(stats.total) / expenses.length) : '$0.00'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Categories Used</span>
            <span className="stat-value">{Object.keys(stats.byCategory || {}).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseReports 
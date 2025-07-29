import { useState, useEffect } from 'react'
import { EXPENSE_CATEGORIES } from '../../utils/expenseUtils'
import { formatCurrency } from '../../utils/expenseUtils'

const BudgetManager = ({ user, expenses, stats }) => {
  const [budgets, setBudgets] = useState({})
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [budgetData, setBudgetData] = useState({
    category: 'Food & Dining',
    amount: '',
    month: new Date().toISOString().slice(0, 7) // YYYY-MM format
  })

  useEffect(() => {
    loadBudgets()
  }, [user])

  const loadBudgets = async () => {
    try {
      // For now, we'll use localStorage. In a real app, this would be stored in Firebase
      const savedBudgets = localStorage.getItem(`budgets_${user.uid}`)
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets))
      }
    } catch (error) {
      console.error('Error loading budgets:', error)
    }
  }

  const saveBudgets = async (newBudgets) => {
    try {
      localStorage.setItem(`budgets_${user.uid}`, JSON.stringify(newBudgets))
      setBudgets(newBudgets)
      return true
    } catch (error) {
      console.error('Error saving budgets:', error)
      return false
    }
  }

  const handleAddBudget = async (e) => {
    e.preventDefault()
    
    if (!budgetData.amount || parseFloat(budgetData.amount) <= 0) {
      alert('Please enter a valid budget amount')
      return
    }

    const budgetKey = `${budgetData.category}_${budgetData.month}`
    const newBudgets = {
      ...budgets,
      [budgetKey]: {
        id: budgetKey,
        category: budgetData.category,
        amount: parseFloat(budgetData.amount),
        month: budgetData.month,
        createdAt: new Date().toISOString()
      }
    }

    const success = await saveBudgets(newBudgets)
    if (success) {
      setBudgetData({
        category: 'Food & Dining',
        amount: '',
        month: new Date().toISOString().slice(0, 7)
      })
      setShowBudgetForm(false)
    }
  }

  const handleDeleteBudget = async (budgetKey) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      const newBudgets = { ...budgets }
      delete newBudgets[budgetKey]
      await saveBudgets(newBudgets)
    }
  }

  const getCurrentMonthSpending = (category) => {
    const currentMonth = new Date().toISOString().slice(0, 7)
    return expenses
      .filter(expense => {
        const expenseMonth = expense.date.slice(0, 7)
        return expense.category === category && expenseMonth === currentMonth
      })
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
  }

  const getBudgetProgress = (category, budgetAmount) => {
    const spent = getCurrentMonthSpending(category)
    const progress = (spent / budgetAmount) * 100
    return {
      spent,
      remaining: budgetAmount - spent,
      progress: Math.min(progress, 100),
      isOverBudget: spent > budgetAmount
    }
  }

  const getProgressColor = (progress, isOverBudget) => {
    if (isOverBudget) return '#dc3545'
    if (progress >= 80) return '#ffc107'
    return '#28a745'
  }

  const currentMonth = new Date().toISOString().slice(0, 7)
  const currentMonthBudgets = Object.values(budgets).filter(
    budget => budget.month === currentMonth
  )

  return (
    <div className="budget-manager">
      <div className="budget-header">
        <h3>Budget Management</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowBudgetForm(true)}
        >
          Add Budget
        </button>
      </div>

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="budget-form">
              <h4>Add Monthly Budget</h4>
              <form onSubmit={handleAddBudget}>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={budgetData.category}
                    onChange={(e) => setBudgetData({...budgetData, category: e.target.value})}
                    required
                  >
                    {EXPENSE_CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Monthly Budget Amount</label>
                  <input
                    type="number"
                    id="amount"
                    value={budgetData.amount}
                    onChange={(e) => setBudgetData({...budgetData, amount: e.target.value})}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="month">Month</label>
                  <input
                    type="month"
                    id="month"
                    value={budgetData.month}
                    onChange={(e) => setBudgetData({...budgetData, month: e.target.value})}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Add Budget
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowBudgetForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      <div className="budget-grid">
        {currentMonthBudgets.length === 0 ? (
          <div className="no-budgets">
            <p>No budgets set for this month. Add a budget to start tracking your spending!</p>
          </div>
        ) : (
          currentMonthBudgets.map(budget => {
            const progress = getBudgetProgress(budget.category, budget.amount)
            const progressColor = getProgressColor(progress.progress, progress.isOverBudget)
            
            return (
              <div key={budget.id} className="budget-card">
                <div className="budget-header">
                  <h4>{budget.category}</h4>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDeleteBudget(budget.id)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="budget-amount">
                  <span className="budget-total">{formatCurrency(budget.amount)}</span>
                  <span className="budget-period">Monthly Budget</span>
                </div>
                
                <div className="budget-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${progress.progress}%`,
                        backgroundColor: progressColor
                      }}
                    ></div>
                  </div>
                  <div className="progress-stats">
                    <span className="spent">{formatCurrency(progress.spent)} spent</span>
                    <span className="remaining">
                      {progress.isOverBudget 
                        ? `${formatCurrency(Math.abs(progress.remaining))} over budget`
                        : `${formatCurrency(progress.remaining)} remaining`
                      }
                    </span>
                  </div>
                </div>
                
                <div className="budget-percentage">
                  {progress.progress.toFixed(1)}% used
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Budget Summary */}
      {currentMonthBudgets.length > 0 && (
        <div className="budget-summary">
          <h4>Budget Summary</h4>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="label">Total Budget:</span>
              <span className="value">
                {formatCurrency(
                  currentMonthBudgets.reduce((sum, budget) => sum + budget.amount, 0)
                )}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Total Spent:</span>
              <span className="value">
                {formatCurrency(
                  currentMonthBudgets.reduce((sum, budget) => 
                    sum + getCurrentMonthSpending(budget.category), 0
                  )
                )}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Remaining:</span>
              <span className="value">
                {formatCurrency(
                  currentMonthBudgets.reduce((sum, budget) => {
                    const progress = getBudgetProgress(budget.category, budget.amount)
                    return sum + progress.remaining
                  }, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetManager 
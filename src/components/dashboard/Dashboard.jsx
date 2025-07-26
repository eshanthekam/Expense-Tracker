import { useState, useEffect } from 'react'
import { getUserExpenses, addExpense, updateExpense, deleteExpense, getExpenseStats } from '../../firebase/expenses'
import { formatCurrency } from '../../utils/expenseUtils'
import ExpenseForm from '../expenses/ExpenseForm'
import ExpenseList from '../expenses/ExpenseList'

const Dashboard = ({ user }) => {
  const [expenses, setExpenses] = useState([])
  const [stats, setStats] = useState({ total: '0.00', count: 0, byCategory: {} })
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExpenses()
  }, [user])

  const loadExpenses = async () => {
    setLoading(true)
    try {
      const result = await getUserExpenses(user.uid)
      if (result.success) {
        setExpenses(result.expenses)
        
        // Load stats
        const statsResult = await getExpenseStats(user.uid)
        if (statsResult.success) {
          setStats(statsResult.stats)
        }
      }
    } catch (error) {
      console.error('Error loading expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (expenseData) => {
    const result = await addExpense(user.uid, expenseData)
    if (result.success) {
      await loadExpenses()
      setShowForm(false)
    } else {
      alert('Error adding expense: ' + result.error)
    }
  }

  const handleUpdateExpense = async (expenseData) => {
    const result = await updateExpense(editingExpense.id, expenseData)
    if (result.success) {
      await loadExpenses()
      setEditingExpense(null)
      setShowForm(false)
    } else {
      alert('Error updating expense: ' + result.error)
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const result = await deleteExpense(expenseId)
      if (result.success) {
        await loadExpenses()
      } else {
        alert('Error deleting expense: ' + result.error)
      }
    }
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleSubmitForm = (expenseData) => {
    if (editingExpense) {
      handleUpdateExpense(expenseData)
    } else {
      handleAddExpense(expenseData)
    }
  }

  if (loading) {
    return <div className="loading">Loading expenses...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Expense
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p className="stat-value">{formatCurrency(stats.total)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-value">{stats.count}</p>
        </div>
        <div className="stat-card">
          <h3>Average per Expense</h3>
          <p className="stat-value">
            {stats.count > 0 ? formatCurrency(stats.total / stats.count) : '$0.00'}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.byCategory).length > 0 && (
        <div className="category-breakdown">
          <h3>Spending by Category</h3>
          <div className="category-list">
            {Object.entries(stats.byCategory)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">{formatCurrency(amount)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Expense Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ExpenseForm
              expense={editingExpense}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />
    </div>
  )
}

export default Dashboard 
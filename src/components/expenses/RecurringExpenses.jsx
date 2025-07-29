import { useState, useEffect } from 'react'
import { EXPENSE_CATEGORIES } from '../../utils/expenseUtils'
import { formatCurrency } from '../../utils/expenseUtils'

const RECURRENCE_TYPES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
]

const RecurringExpenses = ({ user, expenses, onAddExpense }) => {
  const [recurringExpenses, setRecurringExpenses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingRecurring, setEditingRecurring] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Bills & Utilities',
    description: '',
    recurrenceType: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    nextDueDate: new Date().toISOString().split('T')[0],
    isActive: true
  })

  useEffect(() => {
    loadRecurringExpenses()
  }, [user])

  const loadRecurringExpenses = async () => {
    try {
      const savedRecurring = localStorage.getItem(`recurring_${user.uid}`)
      if (savedRecurring) {
        setRecurringExpenses(JSON.parse(savedRecurring))
      }
    } catch (error) {
      console.error('Error loading recurring expenses:', error)
    }
  }

  const saveRecurringExpenses = async (newRecurring) => {
    try {
      localStorage.setItem(`recurring_${user.uid}`, JSON.stringify(newRecurring))
      setRecurringExpenses(newRecurring)
      return true
    } catch (error) {
      console.error('Error saving recurring expenses:', error)
      return false
    }
  }

  const calculateNextDueDate = (currentDate, recurrenceType) => {
    const date = new Date(currentDate)
    
    switch (recurrenceType) {
      case 'weekly':
        date.setDate(date.getDate() + 7)
        break
      case 'biweekly':
        date.setDate(date.getDate() + 14)
        break
      case 'monthly':
        date.setMonth(date.getMonth() + 1)
        break
      case 'quarterly':
        date.setMonth(date.getMonth() + 3)
        break
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1)
        break
      default:
        date.setMonth(date.getMonth() + 1)
    }
    
    return date.toISOString().split('T')[0]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please fill in all required fields with valid values')
      return
    }

    const recurringExpense = {
      id: editingRecurring ? editingRecurring.id : Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount),
      createdAt: editingRecurring ? editingRecurring.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const newRecurringExpenses = editingRecurring
      ? recurringExpenses.map(exp => exp.id === editingRecurring.id ? recurringExpense : exp)
      : [...recurringExpenses, recurringExpense]

    const success = await saveRecurringExpenses(newRecurringExpenses)
    if (success) {
      setFormData({
        title: '',
        amount: '',
        category: 'Bills & Utilities',
        description: '',
        recurrenceType: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        nextDueDate: new Date().toISOString().split('T')[0],
        isActive: true
      })
      setShowForm(false)
      setEditingRecurring(null)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recurring expense?')) {
      const newRecurringExpenses = recurringExpenses.filter(exp => exp.id !== id)
      await saveRecurringExpenses(newRecurringExpenses)
    }
  }

  const handleToggleActive = async (id) => {
    const newRecurringExpenses = recurringExpenses.map(exp => 
      exp.id === id ? { ...exp, isActive: !exp.isActive } : exp
    )
    await saveRecurringExpenses(newRecurringExpenses)
  }

  const handleCreateExpense = async (recurringExpense) => {
    const expenseData = {
      title: recurringExpense.title,
      amount: recurringExpense.amount.toString(),
      category: recurringExpense.category,
      description: recurringExpense.description,
      date: recurringExpense.nextDueDate
    }

    // Call the parent's onAddExpense function
    await onAddExpense(expenseData)

    // Update the next due date
    const newNextDueDate = calculateNextDueDate(recurringExpense.nextDueDate, recurringExpense.recurrenceType)
    const updatedRecurringExpenses = recurringExpenses.map(exp => 
      exp.id === recurringExpense.id 
        ? { ...exp, nextDueDate: newNextDueDate }
        : exp
    )
    await saveRecurringExpenses(updatedRecurringExpenses)
  }

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (dueDate, isActive) => {
    if (!isActive) return '#6c757d'
    const daysUntilDue = getDaysUntilDue(dueDate)
    if (daysUntilDue < 0) return '#dc3545' // Overdue
    if (daysUntilDue <= 3) return '#ffc107' // Due soon
    return '#28a745' // On track
  }

  const getStatusText = (dueDate, isActive) => {
    if (!isActive) return 'Inactive'
    const daysUntilDue = getDaysUntilDue(dueDate)
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`
    if (daysUntilDue === 0) return 'Due today'
    if (daysUntilDue === 1) return 'Due tomorrow'
    if (daysUntilDue <= 3) return `Due in ${daysUntilDue} days`
    return `Due in ${daysUntilDue} days`
  }

  return (
    <div className="recurring-expenses">
      <div className="recurring-header">
        <h3>Recurring Expenses</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Recurring Expense
        </button>
      </div>

      {/* Recurring Expense Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="recurring-form">
              <h4>{editingRecurring ? 'Edit Recurring Expense' : 'Add Recurring Expense'}</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="e.g., Netflix Subscription"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Amount *</label>
                  <input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {EXPENSE_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="recurrenceType">Recurrence</label>
                  <select
                    id="recurrenceType"
                    value={formData.recurrenceType}
                    onChange={(e) => setFormData({...formData, recurrenceType: e.target.value})}
                  >
                    {RECURRENCE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="nextDueDate">Next Due Date *</label>
                  <input
                    type="date"
                    id="nextDueDate"
                    value={formData.nextDueDate}
                    onChange={(e) => setFormData({...formData, nextDueDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Optional description"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    Active
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingRecurring ? 'Update' : 'Add'} Recurring Expense
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false)
                      setEditingRecurring(null)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Expenses List */}
      <div className="recurring-list">
        {recurringExpenses.length === 0 ? (
          <div className="no-recurring">
            <p>No recurring expenses set up. Add your first recurring expense to get started!</p>
          </div>
        ) : (
          <div className="recurring-grid">
            {recurringExpenses.map(expense => {
              const statusColor = getStatusColor(expense.nextDueDate, expense.isActive)
              const statusText = getStatusText(expense.nextDueDate, expense.isActive)
              
              return (
                <div key={expense.id} className="recurring-card">
                  <div className="recurring-header">
                    <h4>{expense.title}</h4>
                    <div className="recurring-actions">
                      <button
                        className="btn btn-small"
                        onClick={() => handleCreateExpense(expense)}
                        disabled={!expense.isActive}
                      >
                        Create Expense
                      </button>
                      <button
                        className="btn btn-small"
                        onClick={() => {
                          setFormData(expense)
                          setEditingRecurring(expense)
                          setShowForm(true)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="recurring-details">
                    <div className="recurring-amount">
                      <span className="amount">{formatCurrency(expense.amount)}</span>
                      <span className="recurrence">{expense.recurrenceType}</span>
                    </div>
                    
                    <div className="recurring-info">
                      <span className="category">{expense.category}</span>
                      <span className="due-date">Due: {new Date(expense.nextDueDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="recurring-status">
                      <span 
                        className="status-indicator"
                        style={{ backgroundColor: statusColor }}
                      >
                        {statusText}
                      </span>
                      <button
                        className={`btn btn-small ${expense.isActive ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleToggleActive(expense.id)}
                      >
                        {expense.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecurringExpenses 
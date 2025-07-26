// Expense categories
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Home & Garden',
  'Other'
]

// Get expenses for a user
export const getUserExpenses = (userId) => {
  try {
    const expenses = localStorage.getItem(`expenses_${userId}`)
    return expenses ? JSON.parse(expenses) : []
  } catch (error) {
    console.error('Error loading expenses:', error)
    return []
  }
}

// Save expenses for a user
export const saveUserExpenses = (userId, expenses) => {
  try {
    localStorage.setItem(`expenses_${userId}`, JSON.stringify(expenses))
    return true
  } catch (error) {
    console.error('Error saving expenses:', error)
    return false
  }
}

// Add a new expense
export const addExpense = (userId, expense) => {
  const expenses = getUserExpenses(userId)
  const newExpense = {
    id: Date.now().toString(),
    ...expense,
    createdAt: new Date().toISOString()
  }
  
  const updatedExpenses = [...expenses, newExpense]
  const success = saveUserExpenses(userId, updatedExpenses)
  
  return success ? newExpense : null
}

// Update an expense
export const updateExpense = (userId, expenseId, updatedExpense) => {
  const expenses = getUserExpenses(userId)
  const expenseIndex = expenses.findIndex(exp => exp.id === expenseId)
  
  if (expenseIndex === -1) return null
  
  const updatedExpenses = [...expenses]
  updatedExpenses[expenseIndex] = {
    ...updatedExpenses[expenseIndex],
    ...updatedExpense,
    updatedAt: new Date().toISOString()
  }
  
  const success = saveUserExpenses(userId, updatedExpenses)
  return success ? updatedExpenses[expenseIndex] : null
}

// Delete an expense
export const deleteExpense = (userId, expenseId) => {
  const expenses = getUserExpenses(userId)
  const updatedExpenses = expenses.filter(exp => exp.id !== expenseId)
  
  return saveUserExpenses(userId, updatedExpenses)
}

// Get expense statistics
export const getExpenseStats = (expenses) => {
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  
  const byCategory = expenses.reduce((acc, exp) => {
    const category = exp.category || 'Other'
    acc[category] = (acc[category] || 0) + parseFloat(exp.amount)
    return acc
  }, {})
  
  const byMonth = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    acc[monthKey] = (acc[monthKey] || 0) + parseFloat(exp.amount)
    return acc
  }, {})
  
  return {
    total: total.toFixed(2),
    byCategory,
    byMonth,
    count: expenses.length
  }
}

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
} 
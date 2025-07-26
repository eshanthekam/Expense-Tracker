import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './config'

// Add a new expense
export const addExpense = async (userId, expenseData) => {
  try {
    const docRef = await addDoc(collection(db, 'expenses'), {
      ...expenseData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return {
      success: true,
      expenseId: docRef.id,
      expense: {
        id: docRef.id,
        ...expenseData,
        userId,
        createdAt: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Error adding expense:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Update an expense
export const updateExpense = async (expenseId, updatedData) => {
  try {
    const expenseRef = doc(db, 'expenses', expenseId)
    await updateDoc(expenseRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    })
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Error updating expense:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Delete an expense
export const deleteExpense = async (expenseId) => {
  try {
    const expenseRef = doc(db, 'expenses', expenseId)
    await deleteDoc(expenseRef)
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Error deleting expense:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get all expenses for a user
export const getUserExpenses = async (userId) => {
  try {
    console.log('Fetching expenses for user:', userId)
    
    // Remove orderBy to avoid index issues, we'll sort in JavaScript
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    const expenses = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      expenses.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })
    })
    
    // Sort by date in JavaScript (newest first)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    console.log('Fetched expenses:', expenses.length, expenses)
    
    return {
      success: true,
      expenses
    }
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return {
      success: false,
      error: error.message,
      expenses: []
    }
  }
}

// Get expense statistics for a user
export const getExpenseStats = async (userId) => {
  try {
    const result = await getUserExpenses(userId)
    if (!result.success) {
      return result
    }
    
    const expenses = result.expenses
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
    
    const byCategory = {}
    expenses.forEach(expense => {
      const category = expense.category || 'Other'
      byCategory[category] = (byCategory[category] || 0) + parseFloat(expense.amount)
    })
    
    return {
      success: true,
      stats: {
        total: total.toFixed(2),
        count: expenses.length,
        byCategory
      }
    }
  } catch (error) {
    console.error('Error calculating stats:', error)
    return {
      success: false,
      error: error.message,
      stats: { total: '0.00', count: 0, byCategory: {} }
    }
  }
}

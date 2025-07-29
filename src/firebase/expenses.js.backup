import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
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
      success: true,
      expenseId
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Delete an expense
export const deleteExpense = async (expenseId) => {
  try {
    await deleteDoc(doc(db, 'expenses', expenseId))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Get all expenses for a user
export const getUserExpenses = async (userId) => {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
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
    
    return {
      success: true,
      expenses
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      expenses: []
    }
  }
}

// Get expense statistics
export const getExpenseStats = async (userId) => {
  try {
    const result = await getUserExpenses(userId)
    
    if (!result.success) {
      return result
    }
    
    const expenses = result.expenses
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
      success: true,
      stats: {
        total: total.toFixed(2),
        byCategory,
        byMonth,
        count: expenses.length
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stats: {
        total: '0.00',
        byCategory: {},
        byMonth: {},
        count: 0
      }
    }
  }
} 
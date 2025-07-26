import { formatCurrency, formatDate } from '../../utils/expenseUtils'

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <p>No expenses found. Add your first expense to get started!</p>
      </div>
    )
  }

  return (
    <div className="expense-list">
      <h3>Recent Expenses</h3>
      
      <div className="expense-items">
        {expenses.map(expense => (
          <div key={expense.id} className="expense-item">
            <div className="expense-info">
              <div className="expense-header">
                <h4 className="expense-title">{expense.title}</h4>
                <span className="expense-amount">{formatCurrency(expense.amount)}</span>
              </div>
              
              <div className="expense-details">
                <span className="expense-category">{expense.category}</span>
                <span className="expense-date">{formatDate(expense.date)}</span>
              </div>
              
              {expense.description && (
                <p className="expense-description">{expense.description}</p>
              )}
            </div>
            
            <div className="expense-actions">
              <button 
                className="btn btn-small btn-secondary"
                onClick={() => onEdit(expense)}
              >
                Edit
              </button>
              <button 
                className="btn btn-small btn-danger"
                onClick={() => onDelete(expense.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpenseList 
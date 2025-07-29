import { useState, useEffect } from 'react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { formatCurrency } from '../../utils/expenseUtils'

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'
]

const ExpenseCharts = ({ expenses, stats }) => {
  const [chartData, setChartData] = useState({
    monthlyData: [],
    categoryData: [],
    weeklyData: []
  })

  useEffect(() => {
    if (expenses.length > 0) {
      processChartData()
    }
  }, [expenses])

  const processChartData = () => {
    // Process monthly spending data
    const monthlySpending = {}
    const weeklySpending = {}
    
    expenses.forEach(expense => {
      const date = new Date(expense.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`
      
      monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + parseFloat(expense.amount)
      weeklySpending[weekKey] = (weeklySpending[weekKey] || 0) + parseFloat(expense.amount)
    })

    // Convert to chart data format
    const monthlyData = Object.entries(monthlySpending)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({
        month: formatMonth(month),
        amount: parseFloat(amount.toFixed(2))
      }))

    const weeklyData = Object.entries(weeklySpending)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8) // Last 8 weeks
      .map(([week, amount]) => ({
        week: `Week ${week.split('-W')[1]}`,
        amount: parseFloat(amount.toFixed(2))
      }))

    // Process category data for pie chart
    const categoryData = Object.entries(stats.byCategory || {})
      .map(([category, amount], index) => ({
        name: category,
        value: parseFloat(amount),
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value)

    setChartData({
      monthlyData,
      categoryData,
      weeklyData
    })
  }

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          <p className="value">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  if (expenses.length === 0) {
    return (
      <div className="charts-container">
        <div className="no-data">
          <p>No expenses to display charts. Add some expenses to see your spending trends!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="charts-container">
      <h3>Spending Analytics</h3>
      
      <div className="charts-grid">
        {/* Monthly Spending Trend */}
        <div className="chart-card">
          <h4>Monthly Spending Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="chart-card">
          <h4>Spending by Category</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Spending */}
        <div className="chart-card">
          <h4>Recent Weekly Spending</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ExpenseCharts 
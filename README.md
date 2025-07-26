# Expense Tracker Web App

A modern, responsive web application for tracking personal expenses with user authentication and comprehensive expense management features.

## 🚀 Features

- **User Authentication**: Register and login with local storage
- **Multi-user Support**: Each user has their own separate expense data
- **Expense Management**: Add, edit, and delete expenses
- **Categories**: 10 predefined expense categories
- **Dashboard Analytics**: View spending statistics and breakdowns
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Data persists between sessions

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Custom CSS with responsive design
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: Browser localStorage
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker-web.git
   cd expense-tracker-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthContainer.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   └── expenses/
│       ├── ExpenseForm.jsx
│       └── ExpenseList.jsx
├── utils/
│   └── expenseUtils.js
├── App.jsx
├── App.css
└── main.jsx
```

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Add Expenses**: Click "Add Expense" to add new expenses with details
3. **View Dashboard**: See your spending statistics and recent expenses
4. **Manage Expenses**: Edit or delete expenses as needed
5. **Logout**: Click logout to end your session

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌟 Features in Detail

### Authentication
- User registration with validation
- Secure login/logout functionality
- Multi-user data isolation

### Expense Management
- Add expenses with title, amount, category, date, and description
- Edit existing expenses
- Delete expenses with confirmation
- 10 predefined categories

### Dashboard Analytics
- Total spent overview
- Total number of expenses
- Average per expense
- Spending breakdown by category
- Recent expenses list

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Data Storage

All data is stored locally in the browser's localStorage:
- User accounts and authentication
- Individual expense data per user
- Data persists between browser sessions

## 🚀 Deployment

This application can be easily deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created with ❤️ for expense tracking needs.

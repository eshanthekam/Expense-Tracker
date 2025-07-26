# Expense Tracker Web App

A modern, responsive web application for tracking personal expenses with Firebase cloud authentication and Firestore database storage.

## 🚀 Features

- **Cloud Authentication**: Secure user registration and login with Firebase Auth
- **Cloud Database**: All data stored securely in Firebase Firestore
- **Multi-user Support**: Each user has their own separate expense data
- **Expense Management**: Add, edit, and delete expenses
- **Categories**: 10 predefined expense categories
- **Dashboard Analytics**: View spending statistics and breakdowns
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Data syncs across all devices

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Styling**: Custom CSS with responsive design
- **State Management**: React Hooks (useState, useEffect)
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

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase config

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Name it: `expense-tracker-web`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### 2. Enable Authentication
1. Go to **Authentication** → **Get started**
2. Click **"Email/Password"** → **Enable**
3. Click **"Save"**

### 3. Enable Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Choose **"Start in test mode"** (for development)
3. Select a location close to you
4. Click **"Done"**

### 4. Get Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click **"Add app"** → **Web app**
4. Name it: `expense-tracker-web`
5. Copy the config values to your `.env` file

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
├── firebase/
│   ├── config.js
│   ├── auth.js
│   └── expenses.js
├── utils/
│   └── expenseUtils.js
├── App.jsx
├── App.css
└── main.jsx
```

## 🎯 Usage

1. **Register/Login**: Create an account or login with email/password
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
- Secure user registration with email/password
- Firebase Authentication integration
- Automatic session management
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

## ☁️ Cloud Storage

All data is stored securely in Firebase:
- **Authentication**: Firebase Auth for user management
- **Database**: Firestore for expense data
- **Security**: Firebase security rules protect user data
- **Real-time**: Data syncs across all devices
- **Scalable**: Handles multiple users and large datasets

## 🚀 Deployment

This application can be easily deployed to:
- **Vercel** (recommended)
- **Netlify**
- **Firebase Hosting**
- Any static hosting service

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## 🔒 Security

- Firebase Authentication provides secure user management
- Firestore security rules ensure data isolation
- Environment variables protect API keys
- HTTPS encryption for all data transmission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created with ❤️ for expense tracking needs.

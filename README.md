# BudgetWise

BudgetWise is a modern, personal finance management application built with Next.js and Firebase. It helps users track expenses, set budgets, and visualize their spending habits through an intuitive and responsive dashboard.

## Features

- **Dashboard Overview**: Get a quick snapshot of your financial health with total spending summaries, budget status, and recent transactions.
- **Expense Tracking**: Easily add, edit, and delete expenses. Categorize transactions to understand where your money goes.
- **Budget Management**: Set monthly budgets for specific categories and track your progress to avoid overspending.
- **Visual Reports**:
  - **Spending by Category**: Pie charts to visualize distribution of expenses.
  - **Spending Over Time**: Bar charts to track daily spending trends.
- **Smart Notifications**: Receive alerts when you are approaching or exceeding your budget limits.
- **Secure Authentication**: User sign-up and login powered by Firebase Authentication.
- **Real-time Data**: Instant updates across devices using Cloud Firestore.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Firebase project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/budgetwise.git
    cd budgetwise
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    - Create a `.env.local` file in the root directory.
    - Add your Firebase configuration keys:
      ```env
      NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
      NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to see the application.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
  - `dashboard`: Main user dashboard.
  - `expenses`: Expense management pages.
  - `budgets`: Budget configuration.
  - `reports`: Visualization and analytics.
- `src/components`: Reusable UI components (Shadcn UI, custom components).
- `src/lib`: Utility functions, types, and helper logic.
- `src/firebase`: Firebase configuration and hooks.

## License

This project is licensed under the MIT License.

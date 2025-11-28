'use client';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  Firestore,
} from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Expense, Budget, Category, Notification } from './types';

// =================================================================
// Notification Generation Logic
// =================================================================

/**
 * Checks if a budget warning notification should be created after adding an expense.
 *
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the user.
 * @param expense - The newly added expense.
 */
export async function checkAndCreateBudgetWarning(
  firestore: Firestore,
  userId: string,
  expense: Omit<Expense, 'id'>
) {
  try {
    // 1. Find the budget for the expense's category.
    const budgetsCol = collection(firestore, 'users', userId, 'budgets');
    const budgetQuery = query(budgetsCol, where('categoryId', '==', expense.categoryId));
    const budgetSnap = await getDocs(budgetQuery);

    if (budgetSnap.empty) {
      return; // No budget set for this category.
    }

    const budget = budgetSnap.docs[0].data() as Budget;
    const budgetId = budgetSnap.docs[0].id;

    // 2. Find the category name
    const categoriesCol = collection(firestore, 'users', userId, 'categories');
    const categoryQuery = query(categoriesCol, where('id', '==', expense.categoryId));
    const categorySnap = await getDocs(categoryQuery);
    const categoryName = !categorySnap.empty ? (categorySnap.docs[0].data() as Category).name : "a category";


    // 3. Calculate total spending for the category in the current month.
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const expensesCol = collection(firestore, 'users', userId, 'expenses');
    const expensesQuery = query(
      expensesCol,
      where('categoryId', '==', expense.categoryId),
      where('date', '>=', Timestamp.fromDate(startOfMonth)),
      where('date', '<=', Timestamp.fromDate(endOfMonth))
    );
    const expensesSnap = await getDocs(expensesQuery);

    const totalSpent = expensesSnap.docs.reduce(
      (sum, doc) => sum + (doc.data() as Expense).amount,
      0
    );

    // 4. Check if a notification for this budget has been sent this month already.
    const notificationsCol = collection(firestore, 'users', userId, 'notifications');
    const notificationQuery = query(
        notificationsCol,
        where('type', '==', 'budget_warning'),
        where('link', '==', `/budgets#${budgetId}`),
        where('createdAt', '>=', Timestamp.fromDate(startOfMonth))
    );
    const notificationSnap = await getDocs(notificationQuery);

    if (!notificationSnap.empty) {
        return; // A warning has already been sent for this budget this month.
    }


    // 5. Determine if a notification is needed (e.g., spent > 90% of budget).
    const spendingThreshold = 0.9;
    if (totalSpent / budget.amount > spendingThreshold) {
      const percentage = Math.round((totalSpent / budget.amount) * 100);
      const newNotification: Omit<Notification, 'id'> = {
        userId,
        message: `You have spent ${percentage}% of your budget for "${categoryName}".`,
        type: 'budget_warning',
        read: false,
        createdAt: Timestamp.now(),
        link: `/budgets#${budgetId}`,
      };

      // 6. Create the notification.
      await addDocumentNonBlocking(
        collection(firestore, 'users', userId, 'notifications'),
        newNotification
      );
    }
  } catch (error) {
    console.error('Error checking/creating budget warning:', error);
    // Silently fail to avoid interrupting user flow.
  }
}

    
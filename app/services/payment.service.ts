import { firebase } from '@nativescript/firebase-core';
import { collection, addDoc, updateDoc, doc, getDoc } from '@nativescript/firebase-firestore';
import { PaymentMethod, Transaction, PaymentIntent } from '../models/payment.model';
import { FIREBASE_CONFIG } from '../core/constants';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

export class PaymentService {
  private static instance: PaymentService;
  private db = firebase.firestore();
  private authService = AuthService.getInstance();

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>): Promise<string> {
    try {
      const user = this.authService.currentUser;
      if (!user) throw new Error('User not authenticated');

      const paymentMethodsRef = collection(this.db, `users/${user.uid}/payment_methods`);
      const docRef = await addDoc(paymentMethodsRef, {
        ...paymentMethod,
        createdAt: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Add payment method error:', error);
      throw error;
    }
  }

  async createTransaction(hotspotId: string, amount: number, paymentMethodId: string): Promise<Transaction> {
    try {
      const user = this.authService.currentUser;
      if (!user) throw new Error('User not authenticated');

      const transaction: Omit<Transaction, 'id'> = {
        userId: user.uid,
        hotspotId,
        amount,
        status: 'pending',
        paymentMethodId,
        createdAt: new Date()
      };

      const transactionRef = await addDoc(
        collection(this.db, FIREBASE_CONFIG.collections.TRANSACTIONS),
        transaction
      );

      return {
        id: transactionRef.id,
        ...transaction
      };
    } catch (error) {
      console.error('Create transaction error:', error);
      throw error;
    }
  }

  async processPayment(transactionId: string): Promise<boolean> {
    try {
      const transactionRef = doc(this.db, FIREBASE_CONFIG.collections.TRANSACTIONS, transactionId);
      const transactionDoc = await getDoc(transactionRef);
      
      if (!transactionDoc.exists()) {
        throw new Error('Transaction not found');
      }

      const transaction = transactionDoc.data() as Transaction;
      
      // In a real app, we would integrate with a payment gateway here
      const success = true; // Simulated payment success

      if (success) {
        await updateDoc(transactionRef, {
          status: 'completed',
          completedAt: new Date()
        });

        // Update user balance
        const hotspotDoc = await getDoc(doc(this.db, FIREBASE_CONFIG.collections.HOTSPOTS, transaction.hotspotId));
        const hotspot = hotspotDoc.data();
        
        await UserService.updateUserBalance(hotspot.providerId, transaction.amount);
      } else {
        await updateDoc(transactionRef, {
          status: 'failed',
          completedAt: new Date()
        });
      }

      return success;
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  }

  async getTransactionHistory(userId: string): Promise<Transaction[]> {
    try {
      const transactionsRef = collection(this.db, FIREBASE_CONFIG.collections.TRANSACTIONS);
      const querySnapshot = await firebase.firestore().collection(FIREBASE_CONFIG.collections.TRANSACTIONS)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Transaction));
    } catch (error) {
      console.error('Get transaction history error:', error);
      throw error;
    }
  }
}
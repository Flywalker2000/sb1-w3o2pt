import { firebase } from '@nativescript/firebase-core';
import { collection, doc, getDoc, setDoc, updateDoc } from '@nativescript/firebase-firestore';
import { User } from '../models/user.model';
import { FIREBASE_CONFIG } from '../core/constants';

export class UserService {
  private static db = firebase.firestore();

  static async createUserProfile(user: User): Promise<void> {
    try {
      const userRef = doc(this.db, FIREBASE_CONFIG.collections.USERS, user.id);
      await setDoc(userRef, user);
    } catch (error) {
      console.error('Create user profile error:', error);
      throw error;
    }
  }

  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userRef = doc(this.db, FIREBASE_CONFIG.collections.USERS, userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? userDoc.data() as User : null;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  static async updateUserBalance(userId: string, amount: number): Promise<void> {
    try {
      const userRef = doc(this.db, FIREBASE_CONFIG.collections.USERS, userId);
      await updateDoc(userRef, { balance: amount });
    } catch (error) {
      console.error('Update user balance error:', error);
      throw error;
    }
  }
}
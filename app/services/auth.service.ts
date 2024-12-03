import { Observable } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from '@nativescript/firebase-auth';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { APP_CONSTANTS } from '../core/constants';

export class AuthService extends Observable {
  private static instance: AuthService;
  private auth: Auth;

  private constructor() {
    super();
    this.auth = firebase.auth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  static async initialize(): Promise<void> {
    const instance = AuthService.getInstance();
    instance.auth.onAuthStateChanged((user: User | null) => {
      instance.notifyPropertyChange('currentUser', user);
    });
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      await StorageService.saveSecure('user_token', await userCredential.user.getIdToken());
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, name: string, isProvider: boolean): Promise<User> {
    if (password.length < APP_CONSTANTS.MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${APP_CONSTANTS.MIN_PASSWORD_LENGTH} characters long`);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await UserService.createUserProfile({
        id: userCredential.user.uid,
        email,
        name,
        isProvider,
        balance: 0,
        createdAt: new Date()
      });
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      await StorageService.removeSecure('user_token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }
}
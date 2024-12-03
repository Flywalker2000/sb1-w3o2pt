import { Observable } from '@nativescript/core';
import { AuthService } from '../../../services/auth.service';
import { NavigationService } from '../../../services/navigation.service';
import * as EmailValidator from 'email-validator';
import { APP_CONSTANTS } from '../../../core/constants';

export class RegisterViewModel extends Observable {
  private authService: AuthService;
  
  public name: string = '';
  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  public isProvider: boolean = false;
  public isLoading: boolean = false;
  public errorMessage: string = '';

  constructor() {
    super();
    this.authService = AuthService.getInstance();
  }

  async onRegister() {
    if (!this.validateInput()) {
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      await this.authService.register(
        this.email,
        this.password,
        this.name,
        this.isProvider
      );
      
      NavigationService.navigateWithClearHistory('views/main/map/map-page');
    } catch (error) {
      this.errorMessage = 'Registration failed. Please try again.';
      console.error('Registration error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onBack() {
    NavigationService.goBack();
  }

  private validateInput(): boolean {
    if (!this.name.trim()) {
      this.errorMessage = 'Please enter your name';
      return false;
    }

    if (!EmailValidator.validate(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (this.password.length < APP_CONSTANTS.MIN_PASSWORD_LENGTH) {
      this.errorMessage = `Password must be at least ${APP_CONSTANTS.MIN_PASSWORD_LENGTH} characters long`;
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    return true;
  }
}
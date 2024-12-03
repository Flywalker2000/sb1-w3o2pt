import { Observable } from '@nativescript/core';
import { AuthService } from '../../../services/auth.service';
import { NavigationService } from '../../../services/navigation.service';
import * as EmailValidator from 'email-validator';

export class LoginViewModel extends Observable {
  private authService: AuthService;
  public email: string = '';
  public password: string = '';
  public isLoading: boolean = false;
  public errorMessage: string = '';

  constructor() {
    super();
    this.authService = AuthService.getInstance();
  }

  async onLogin() {
    if (!this.validateInput()) {
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      await this.authService.login(this.email, this.password);
      NavigationService.navigate('views/main/map/map-page');
    } catch (error) {
      this.errorMessage = 'Invalid credentials. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  onRegister() {
    NavigationService.navigate('views/auth/register/register-page');
  }

  private validateInput(): boolean {
    if (!EmailValidator.validate(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter your password';
      return false;
    }

    return true;
  }
}
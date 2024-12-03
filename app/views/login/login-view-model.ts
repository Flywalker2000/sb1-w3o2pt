import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';

export class LoginViewModel extends Observable {
  private authService: AuthService;
  public email: string = '';
  public password: string = '';
  public errorMessage: string = '';

  constructor() {
    super();
    this.authService = new AuthService();
  }

  async onLogin() {
    try {
      const success = await this.authService.login(this.email, this.password);
      if (success) {
        // TODO: Navigate to main page
      } else {
        this.errorMessage = 'Invalid credentials';
      }
    } catch (error) {
      this.errorMessage = 'Login failed. Please try again.';
    }
  }

  onRegister() {
    // TODO: Navigate to registration page
  }
}
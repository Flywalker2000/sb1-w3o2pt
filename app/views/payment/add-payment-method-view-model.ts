import { Observable } from '@nativescript/core';
import { PaymentService } from '../../services/payment.service';
import { NavigationService } from '../../services/navigation.service';

export class AddPaymentMethodViewModel extends Observable {
  private paymentService: PaymentService;

  public cardNumber: string = '';
  public expiry: string = '';
  public cvv: string = '';
  public isLoading: boolean = false;
  public errorMessage: string = '';

  constructor() {
    super();
    this.paymentService = PaymentService.getInstance();
  }

  async onAddCard() {
    if (!this.validateInput()) {
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';

      const [expiryMonth, expiryYear] = this.parseExpiry();
      
      await this.paymentService.addPaymentMethod({
        type: 'card',
        last4: this.cardNumber.slice(-4),
        expiryMonth,
        expiryYear,
        isDefault: true
      });

      NavigationService.goBack();
    } catch (error) {
      this.errorMessage = 'Failed to add card. Please try again.';
      console.error('Add card error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onBack() {
    NavigationService.goBack();
  }

  private validateInput(): boolean {
    if (!/^\d{16}$/.test(this.cardNumber)) {
      this.errorMessage = 'Please enter a valid 16-digit card number';
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(this.expiry)) {
      this.errorMessage = 'Please enter expiry in MM/YY format';
      return false;
    }

    if (!/^\d{3,4}$/.test(this.cvv)) {
      this.errorMessage = 'Please enter a valid CVV';
      return false;
    }

    return true;
  }

  private parseExpiry(): [number, number] {
    const [month, year] = this.expiry.split('/');
    return [parseInt(month, 10), parseInt(`20${year}`, 10)];
  }
}
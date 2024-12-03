import { Observable } from '@nativescript/core';
import { Hotspot } from '../../models/hotspot.model';
import { PaymentMethod } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';
import { HotspotService } from '../../services/hotspot.service';
import { NavigationService } from '../../services/navigation.service';

export class ConnectViewModel extends Observable {
  private paymentService: PaymentService;
  private hotspotService: HotspotService;

  public hotspot: Hotspot;
  public paymentMethods: PaymentMethod[] = [];
  public selectedPaymentMethod: PaymentMethod | null = null;
  public isLoading: boolean = false;
  public errorMessage: string = '';

  constructor(hotspot: Hotspot) {
    super();
    this.hotspot = hotspot;
    this.paymentService = PaymentService.getInstance();
    this.hotspotService = HotspotService.getInstance();
    this.loadPaymentMethods();
  }

  async loadPaymentMethods() {
    try {
      this.isLoading = true;
      this.paymentMethods = await this.paymentService.getPaymentMethods();
      this.selectedPaymentMethod = this.paymentMethods.find(pm => pm.isDefault) || null;
      this.notifyPropertyChange('paymentMethods', this.paymentMethods);
      this.notifyPropertyChange('selectedPaymentMethod', this.selectedPaymentMethod);
    } catch (error) {
      console.error('Load payment methods error:', error);
      this.errorMessage = 'Failed to load payment methods';
    } finally {
      this.isLoading = false;
    }
  }

  async onConnect() {
    if (!this.selectedPaymentMethod) {
      this.errorMessage = 'Please select a payment method';
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';

      // Create transaction
      const transaction = await this.paymentService.createTransaction(
        this.hotspot.id,
        this.hotspot.settings.price,
        this.selectedPaymentMethod.id
      );

      // Process payment
      const success = await this.paymentService.processPayment(transaction.id);
      
      if (success) {
        // Create hotspot connection
        await this.hotspotService.createConnection(this.hotspot.id);
        NavigationService.navigate('views/hotspot/connection-status-page', {
          hotspotId: this.hotspot.id
        });
      } else {
        this.errorMessage = 'Payment failed. Please try again.';
      }
    } catch (error) {
      console.error('Connection error:', error);
      this.errorMessage = 'Failed to establish connection';
    } finally {
      this.isLoading = false;
    }
  }

  onAddPaymentMethod() {
    NavigationService.navigate('views/payment/add-payment-method-page');
  }

  onBack() {
    NavigationService.goBack();
  }
}
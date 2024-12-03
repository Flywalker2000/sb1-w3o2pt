import { Observable } from '@nativescript/core';
import { PaymentService } from '../../services/payment.service';
import { NavigationService } from '../../services/navigation.service';
import { Transaction } from '../../models/payment.model';
import { HotspotService } from '../../services/hotspot.service';
import { AuthService } from '../../services/auth.service';

interface TransactionViewModel extends Transaction {
  hotspotName: string;
}

export class TransactionHistoryViewModel extends Observable {
  private paymentService: PaymentService;
  private hotspotService: HotspotService;
  private authService: AuthService;

  public transactions: TransactionViewModel[] = [];
  public isLoading: boolean = false;

  constructor() {
    super();
    this.paymentService = PaymentService.getInstance();
    this.hotspotService = HotspotService.getInstance();
    this.authService = AuthService.getInstance();
    this.loadTransactions();
  }

  async loadTransactions() {
    try {
      this.isLoading = true;
      const user = this.authService.currentUser;
      if (!user) throw new Error('User not authenticated');

      const transactions = await this.paymentService.getTransactionHistory(user.uid);
      this.transactions = await Promise.all(
        transactions.map(async transaction => {
          const hotspot = await this.hotspotService.getHotspotById(transaction.hotspotId);
          return {
            ...transaction,
            hotspotName: hotspot?.name || 'Unknown Hotspot'
          };
        })
      );

      this.notifyPropertyChange('transactions', this.transactions);
    } catch (error) {
      console.error('Load transactions error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  }

  onBack() {
    NavigationService.goBack();
  }
}
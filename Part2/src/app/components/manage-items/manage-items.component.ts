import { Component } from '@angular/core';
import { Category, InventoryItem, StockStatus } from '../../models/inventory-item.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-manage-items',
  templateUrl: './manage-items.component.html'
})
export class ManageItemsComponent {
  categories: Category[] = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  stockStatuses: StockStatus[] = ['In Stock', 'Low Stock', 'Out of Stock'];

  form: InventoryItem = this.emptyForm();
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  pendingDelete = false;

  constructor(private readonly inventoryService: InventoryService) {}

  get items(): InventoryItem[] {
    return this.inventoryService.getAllItems();
  }

  addItem(): void {
    if (!this.validateForm()) {
      return;
    }
    const result = this.inventoryService.add({ ...this.form });
    this.showMessage(result.message, result.ok ? 'success' : 'error');
    if (result.ok) {
      this.form = this.emptyForm();
    }
  }

  updateItemByName(): void {
    const originalName: string = this.form.name.trim();
    if (!originalName) {
      this.showMessage('Enter item name first. Update uses item name.', 'error');
      return;
    }
    if (!this.validateForm()) {
      return;
    }
    const result = this.inventoryService.updateByName(originalName, { ...this.form });
    this.showMessage(result.message, result.ok ? 'success' : 'error');
  }

  requestDelete(): void {
    const name: string = this.form.name.trim();
    if (!name) {
      this.showMessage('Enter an item name to delete.', 'error');
      return;
    }
    this.pendingDelete = true;
    this.showMessage(`Confirm deletion for '${name}'?`, 'info');
  }

  confirmDelete(): void {
    const result = this.inventoryService.deleteByName(this.form.name.trim());
    this.pendingDelete = false;
    this.showMessage(result.message, result.ok ? 'success' : 'error');
    if (result.ok) {
      this.form = this.emptyForm();
    }
  }

  cancelDelete(): void {
    this.pendingDelete = false;
    this.showMessage('Delete cancelled.', 'info');
  }

  loadByName(): void {
    const name: string = this.form.name.trim();
    if (!name) {
      this.showMessage('Enter item name to load details.', 'error');
      return;
    }
    const found: InventoryItem | undefined = this.inventoryService.findByName(name);
    if (!found) {
      this.showMessage(`No item found with name '${name}'.`, 'error');
      return;
    }
    this.form = { ...found };
    this.showMessage(`Loaded '${found.name}' into form.`, 'success');
  }

  private validateForm(): boolean {
    if (!this.form.id.trim() || !this.form.name.trim() || !this.form.supplier.trim()) {
      this.showMessage('All fields except comment are required.', 'error');
      return false;
    }
    if (!Number.isInteger(this.form.quantity) || this.form.quantity < 0) {
      this.showMessage('Quantity must be a whole number >= 0.', 'error');
      return false;
    }
    if (!Number.isFinite(this.form.price) || this.form.price < 0) {
      this.showMessage('Price must be a number >= 0.', 'error');
      return false;
    }
    return true;
  }

  private showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
    this.message = msg;
    this.messageType = type;
  }

  private emptyForm(): InventoryItem {
    return {
      id: '',
      name: '',
      category: 'Electronics',
      quantity: 0,
      price: 0,
      supplier: '',
      stockStatus: 'In Stock',
      popular: false,
      comment: ''
    };
  }
}

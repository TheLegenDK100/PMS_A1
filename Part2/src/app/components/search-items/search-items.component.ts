import { Component } from '@angular/core';
import { InventoryItem } from '../../models/inventory-item.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-search-items',
  templateUrl: './search-items.component.html'
})
export class SearchItemsComponent {
  query = '';
  filtered: InventoryItem[] = [];
  message = 'Search items by name or display all/popular items.';

  constructor(private readonly inventoryService: InventoryService) {
    this.showAll();
  }

  search(): void {
    const input: string = this.query.trim();
    if (!input) {
      this.message = 'Enter text to search by item name.';
      return;
    }
    this.filtered = this.inventoryService.searchByName(input);
    this.message = `Found ${this.filtered.length} item(s) for '${input}'.`;
  }

  showAll(): void {
    this.filtered = this.inventoryService.getAllItems();
    this.message = `Showing all ${this.filtered.length} item(s).`;
  }

  showPopular(): void {
    this.filtered = this.inventoryService.getPopularItems();
    this.message = `Showing ${this.filtered.length} popular item(s).`;
  }
}

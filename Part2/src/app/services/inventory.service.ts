import { Injectable } from '@angular/core';
import { InventoryItem } from '../models/inventory-item.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly items: InventoryItem[] = [
    {
      id: 'A101',
      name: 'LED Monitor',
      category: 'Electronics',
      quantity: 12,
      price: 219.99,
      supplier: 'TechSource',
      stockStatus: 'In Stock',
      popular: true,
      comment: 'Best-seller for small offices.'
    },
    {
      id: 'F502',
      name: 'Oak Dining Table',
      category: 'Furniture',
      quantity: 3,
      price: 899,
      supplier: 'HomeCraft',
      stockStatus: 'Low Stock',
      popular: false
    }
  ];

  getAllItems(): InventoryItem[] {
    return [...this.items];
  }

  getPopularItems(): InventoryItem[] {
    return this.items.filter((item: InventoryItem) => item.popular);
  }

  findByName(name: string): InventoryItem | undefined {
    return this.items.find((item: InventoryItem) => item.name.toLowerCase() === name.toLowerCase());
  }

  searchByName(query: string): InventoryItem[] {
    const q: string = query.toLowerCase().trim();
    return this.items.filter((item: InventoryItem) => item.name.toLowerCase().includes(q));
  }

  add(item: InventoryItem): { ok: boolean; message: string } {
    const duplicateId: boolean = this.items.some((x: InventoryItem) => x.id.toLowerCase() === item.id.toLowerCase());
    if (duplicateId) {
      return { ok: false, message: `Item ID '${item.id}' already exists.` };
    }
    const duplicateName: boolean = this.items.some((x: InventoryItem) => x.name.toLowerCase() === item.name.toLowerCase());
    if (duplicateName) {
      return { ok: false, message: `Item name '${item.name}' already exists.` };
    }
    this.items.push(item);
    return { ok: true, message: `Added '${item.name}' successfully.` };
  }

  updateByName(originalName: string, updated: InventoryItem): { ok: boolean; message: string } {
    const current: InventoryItem | undefined = this.findByName(originalName);
    if (!current) {
      return { ok: false, message: `No item found with name '${originalName}'.` };
    }

    const duplicateId: boolean = this.items.some(
      (x: InventoryItem) => x !== current && x.id.toLowerCase() === updated.id.toLowerCase()
    );
    if (duplicateId) {
      return { ok: false, message: `Another item already uses ID '${updated.id}'.` };
    }

    const duplicateName: boolean = this.items.some(
      (x: InventoryItem) => x !== current && x.name.toLowerCase() === updated.name.toLowerCase()
    );
    if (duplicateName) {
      return { ok: false, message: `Another item already uses name '${updated.name}'.` };
    }

    current.id = updated.id;
    current.name = updated.name;
    current.category = updated.category;
    current.quantity = updated.quantity;
    current.price = updated.price;
    current.supplier = updated.supplier;
    current.stockStatus = updated.stockStatus;
    current.popular = updated.popular;
    current.comment = updated.comment;

    return { ok: true, message: `Updated '${updated.name}' successfully.` };
  }

  deleteByName(name: string): { ok: boolean; message: string } {
    const index: number = this.items.findIndex((x: InventoryItem) => x.name.toLowerCase() === name.toLowerCase());
    if (index < 0) {
      return { ok: false, message: `No item found with name '${name}'.` };
    }
    const deletedName: string = this.items[index].name;
    this.items.splice(index, 1);
    return { ok: true, message: `Deleted '${deletedName}' successfully.` };
  }
}

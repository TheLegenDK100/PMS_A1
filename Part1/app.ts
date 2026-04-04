interface Item {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  price: number;
  supplier: string;
  stockStatus: StockStatus;
  popular: boolean;
  comment?: string;
}

type Category = 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

const inventory: Item[] = [
  {
    id: 'A101',
    name: 'LED Monitor',
    category: 'Electronics',
    quantity: 12,
    price: 219.99,
    supplier: 'TechSource',
    stockStatus: 'In Stock',
    popular: true,
    comment: 'Best-seller for small offices.',
  },
  {
    id: 'F502',
    name: 'Oak Dining Table',
    category: 'Furniture',
    quantity: 3,
    price: 899.0,
    supplier: 'HomeCraft',
    stockStatus: 'Low Stock',
    popular: false,
    comment: 'Limited stock available.',
  },
  {
    id: 'T307',
    name: 'Cordless Drill',
    category: 'Tools',
    quantity: 0,
    price: 139.5,
    supplier: 'BuildRight',
    stockStatus: 'Out of Stock',
    popular: true,
    comment: 'Expected restock next week.',
  },
];

const elements = {
  itemId: document.getElementById('itemId') as HTMLInputElement,
  itemName: document.getElementById('itemName') as HTMLInputElement,
  itemCategory: document.getElementById('itemCategory') as HTMLSelectElement,
  itemQuantity: document.getElementById('itemQuantity') as HTMLInputElement,
  itemPrice: document.getElementById('itemPrice') as HTMLInputElement,
  itemSupplier: document.getElementById('itemSupplier') as HTMLInputElement,
  itemStock: document.getElementById('itemStock') as HTMLSelectElement,
  itemPopular: document.getElementById('itemPopular') as HTMLSelectElement,
  itemComment: document.getElementById('itemComment') as HTMLTextAreaElement,
  searchInput: document.getElementById('searchInput') as HTMLInputElement,
  addButton: document.getElementById('addButton') as HTMLButtonElement,
  updateButton: document.getElementById('updateButton') as HTMLButtonElement,
  deleteButton: document.getElementById('deleteButton') as HTMLButtonElement,
  searchButton: document.getElementById('searchButton') as HTMLButtonElement,
  showAllButton: document.getElementById('showAllButton') as HTMLButtonElement,
  showPopularButton: document.getElementById('showPopularButton') as HTMLButtonElement,
  messageBox: document.getElementById('messageBox') as HTMLDivElement,
  results: document.getElementById('results') as HTMLDivElement,
};

let pendingDeleteName: string | null = null;

function showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  elements.messageBox.innerHTML = message;
  elements.messageBox.className = `message ${type}`;
  pendingDeleteName = null;
}

function renderItems(items: Item[]): void {
  if (items.length === 0) {
    elements.results.innerHTML = '<p>No matching items found.</p>';
    return;
  }

  const rows = items
    .map(
      (item: Item) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.supplier}</td>
        <td>${item.stockStatus}</td>
        <td>${item.popular ? 'Yes' : 'No'}</td>
        <td>${item.comment ?? ''}</td>
      </tr>
    `,
    )
    .join('');

  elements.results.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Supplier</th>
          <th>Stock</th>
          <th>Popular</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function clearForm(): void {
  elements.itemId.value = '';
  elements.itemName.value = '';
  elements.itemCategory.value = 'Electronics';
  elements.itemQuantity.value = '';
  elements.itemPrice.value = '';
  elements.itemSupplier.value = '';
  elements.itemStock.value = 'In Stock';
  elements.itemPopular.value = 'No';
  elements.itemComment.value = '';
}

function validateItemInput(item: Item): string | null {
  if (!item.id || !item.name || !item.supplier) {
    return 'Please complete all required fields before saving.';
  }

  if (!Number.isFinite(item.quantity) || item.quantity < 0 || !Number.isInteger(item.quantity)) {
    return 'Quantity must be a whole number equal to or greater than 0.';
  }

  if (!Number.isFinite(item.price) || item.price < 0) {
    return 'Price must be a number equal to or greater than 0.';
  }

  return null;
}

function getFormItem(): Item | null {
  const id = elements.itemId.value.trim();
  const name = elements.itemName.value.trim();
  const category = elements.itemCategory.value as Category;
  const supplier = elements.itemSupplier.value.trim();
  const stockStatus = elements.itemStock.value as StockStatus;
  const popular = elements.itemPopular.value === 'Yes';
  const comment = elements.itemComment.value.trim();
  const quantityValue = Number(elements.itemQuantity.value);
  const priceValue = Number(elements.itemPrice.value);

  const draft: Item = {
    id,
    name,
    category,
    quantity: quantityValue,
    price: priceValue,
    supplier,
    stockStatus,
    popular,
    comment: comment || undefined,
  };

  const validationError = validateItemInput(draft);
  if (validationError) {
    showMessage(validationError, 'error');
    return null;
  }

  return draft;
}

function findByName(name: string): Item | undefined {
  return inventory.find((item: Item) => item.name.toLowerCase() === name.toLowerCase());
}

function addItem(): void {
  const newItem = getFormItem();
  if (!newItem) {
    return;
  }

  if (inventory.some((item: Item) => item.id.toLowerCase() === newItem.id.toLowerCase())) {
    showMessage(`Item ID '${newItem.id}' already exists. Please provide a unique ID.`, 'error');
    return;
  }

  if (inventory.some((item: Item) => item.name.toLowerCase() === newItem.name.toLowerCase())) {
    showMessage(`Item name '${newItem.name}' already exists. Please provide a unique name.`, 'error');
    return;
  }

  inventory.push(newItem);
  renderItems(inventory);
  showMessage(`Added '${newItem.name}' successfully.`, 'success');
  clearForm();
}

function updateItem(): void {
  const name = elements.itemName.value.trim();
  if (!name) {
    showMessage('Enter the item name to update the existing record.', 'error');
    return;
  }

  const existingItem = findByName(name);
  if (!existingItem) {
    showMessage(`No item found with the name '${name}'.`, 'error');
    return;
  }

  const updated = getFormItem();
  if (!updated) {
    return;
  }

  if (updated.name.toLowerCase() !== existingItem.name.toLowerCase()) {
    const duplicateName = inventory.some(
      (item: Item) => item.name.toLowerCase() === updated.name.toLowerCase(),
    );
    if (duplicateName) {
      showMessage('Another item already uses that name. Please use a unique item name.', 'error');
      return;
    }
  }

  if (updated.id.toLowerCase() !== existingItem.id.toLowerCase()) {
    const duplicateId = inventory.some((item: Item) => item.id.toLowerCase() === updated.id.toLowerCase());
    if (duplicateId) {
      showMessage('A different item already uses that ID. Keep the ID unique.', 'error');
      return;
    }
  }

  existingItem.id = updated.id;
  existingItem.category = updated.category;
  existingItem.quantity = updated.quantity;
  existingItem.price = updated.price;
  existingItem.supplier = updated.supplier;
  existingItem.stockStatus = updated.stockStatus;
  existingItem.popular = updated.popular;
  existingItem.comment = updated.comment;
  existingItem.name = updated.name;

  renderItems(inventory);
  showMessage(`Updated item '${updated.name}'.`, 'success');
  clearForm();
}

function deleteItem(): void {
  const name = elements.itemName.value.trim();
  if (!name) {
    showMessage('Enter the item name to delete the record.', 'error');
    return;
  }

  const index = inventory.findIndex((item: Item) => item.name.toLowerCase() === name.toLowerCase());
  if (index < 0) {
    showMessage(`No item found with the name '${name}'.`, 'error');
    return;
  }

  pendingDeleteName = inventory[index].name;
  elements.messageBox.className = 'message info';
  elements.messageBox.innerHTML = `
    <div class="confirm-wrap">
      <span>Delete '${pendingDeleteName}' from inventory?</span>
      <div class="confirm-actions">
        <button id="confirmDeleteButton" type="button">Confirm Delete</button>
        <button id="cancelDeleteButton" type="button" class="secondary-btn">Cancel</button>
      </div>
    </div>
  `;

  const confirmDeleteButton = document.getElementById('confirmDeleteButton') as HTMLButtonElement | null;
  const cancelDeleteButton = document.getElementById('cancelDeleteButton') as HTMLButtonElement | null;

  if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener('click', confirmDelete);
  }
  if (cancelDeleteButton) {
    cancelDeleteButton.addEventListener('click', cancelDelete);
  }
}

function confirmDelete(): void {
  if (!pendingDeleteName) {
    showMessage('No item is currently selected for deletion.', 'error');
    return;
  }

  const index = inventory.findIndex(
    (item: Item) => item.name.toLowerCase() === pendingDeleteName?.toLowerCase(),
  );
  if (index < 0) {
    showMessage(`Could not find '${pendingDeleteName}' to delete.`, 'error');
    return;
  }

  const itemName = inventory[index].name;
  inventory.splice(index, 1);
  renderItems(inventory);
  showMessage(`Deleted '${itemName}' from inventory.`, 'success');
  clearForm();
}

function cancelDelete(): void {
  showMessage('Delete action cancelled.', 'info');
}

function searchItems(): void {
  const query = elements.searchInput.value.trim().toLowerCase();
  if (!query) {
    showMessage('Enter search text to find items by name.', 'error');
    return;
  }

  const results = inventory.filter((item: Item) => item.name.toLowerCase().includes(query));
  renderItems(results);
  showMessage(`Found ${results.length} item(s) matching '${elements.searchInput.value.trim()}'.`, 'info');
}

function showAllItems(): void {
  renderItems(inventory);
  showMessage(`Displaying all ${inventory.length} inventory item(s).`, 'info');
}

function showPopularItems(): void {
  const popularItems = inventory.filter((item: Item) => item.popular);
  renderItems(popularItems);
  showMessage(`Displaying ${popularItems.length} popular item(s).`, 'info');
}

function bindEvents(): void {
  elements.addButton.addEventListener('click', addItem);
  elements.updateButton.addEventListener('click', updateItem);
  elements.deleteButton.addEventListener('click', deleteItem);
  elements.searchButton.addEventListener('click', searchItems);
  elements.showAllButton.addEventListener('click', showAllItems);
  elements.showPopularButton.addEventListener('click', showPopularItems);
}

function initialize(): void {
  bindEvents();
  renderItems(inventory);
  showMessage('Ready to manage inventory. Use the form to add, update, or delete items.', 'info');
}

initialize();

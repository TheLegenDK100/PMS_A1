const inventory = [
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
  itemId: document.getElementById('itemId'),
  itemName: document.getElementById('itemName'),
  itemCategory: document.getElementById('itemCategory'),
  itemQuantity: document.getElementById('itemQuantity'),
  itemPrice: document.getElementById('itemPrice'),
  itemSupplier: document.getElementById('itemSupplier'),
  itemStock: document.getElementById('itemStock'),
  itemPopular: document.getElementById('itemPopular'),
  itemComment: document.getElementById('itemComment'),
  searchInput: document.getElementById('searchInput'),
  addButton: document.getElementById('addButton'),
  updateButton: document.getElementById('updateButton'),
  deleteButton: document.getElementById('deleteButton'),
  searchButton: document.getElementById('searchButton'),
  showAllButton: document.getElementById('showAllButton'),
  showPopularButton: document.getElementById('showPopularButton'),
  messageBox: document.getElementById('messageBox'),
  results: document.getElementById('results'),
};

let pendingDeleteName = null;

function showMessage(message, type = 'info') {
  elements.messageBox.innerHTML = message;
  elements.messageBox.className = `message ${type}`;
  pendingDeleteName = null;
}

function renderItems(items) {
  if (items.length === 0) {
    elements.results.innerHTML = '<p>No matching items found.</p>';
    return;
  }

  const rows = items
    .map(
      (item) => `
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

function clearForm() {
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

function validateItemInput(item) {
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

function getFormItem() {
  const id = elements.itemId.value.trim();
  const name = elements.itemName.value.trim();
  const category = elements.itemCategory.value;
  const supplier = elements.itemSupplier.value.trim();
  const stockStatus = elements.itemStock.value;
  const popular = elements.itemPopular.value === 'Yes';
  const comment = elements.itemComment.value.trim();
  const quantityValue = Number(elements.itemQuantity.value);
  const priceValue = Number(elements.itemPrice.value);

  const draft = {
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

function findByName(name) {
  return inventory.find((item) => item.name.toLowerCase() === name.toLowerCase());
}

function addItem() {
  const newItem = getFormItem();
  if (!newItem) {
    return;
  }
  if (inventory.some((item) => item.id.toLowerCase() === newItem.id.toLowerCase())) {
    showMessage(`Item ID '${newItem.id}' already exists. Please provide a unique ID.`, 'error');
    return;
  }
  if (inventory.some((item) => item.name.toLowerCase() === newItem.name.toLowerCase())) {
    showMessage(`Item name '${newItem.name}' already exists. Please provide a unique name.`, 'error');
    return;
  }

  inventory.push(newItem);
  renderItems(inventory);
  showMessage(`Added '${newItem.name}' successfully.`, 'success');
  clearForm();
}

function updateItem() {
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
    const duplicateName = inventory.some((item) => item.name.toLowerCase() === updated.name.toLowerCase());
    if (duplicateName) {
      showMessage('Another item already uses that name. Please use a unique item name.', 'error');
      return;
    }
  }

  if (updated.id.toLowerCase() !== existingItem.id.toLowerCase()) {
    const duplicateId = inventory.some((item) => item.id.toLowerCase() === updated.id.toLowerCase());
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

function deleteItem() {
  const name = elements.itemName.value.trim();
  if (!name) {
    showMessage('Enter the item name to delete the record.', 'error');
    return;
  }

  const index = inventory.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
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

  const confirmDeleteButton = document.getElementById('confirmDeleteButton');
  const cancelDeleteButton = document.getElementById('cancelDeleteButton');
  if (confirmDeleteButton) confirmDeleteButton.addEventListener('click', confirmDelete);
  if (cancelDeleteButton) cancelDeleteButton.addEventListener('click', cancelDelete);
}

function confirmDelete() {
  if (!pendingDeleteName) {
    showMessage('No item is currently selected for deletion.', 'error');
    return;
  }

  const index = inventory.findIndex((item) => item.name.toLowerCase() === pendingDeleteName.toLowerCase());
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

function cancelDelete() {
  showMessage('Delete action cancelled.', 'info');
}

function searchItems() {
  const query = elements.searchInput.value.trim().toLowerCase();
  if (!query) {
    showMessage('Enter search text to find items by name.', 'error');
    return;
  }

  const results = inventory.filter((item) => item.name.toLowerCase().includes(query));
  renderItems(results);
  showMessage(`Found ${results.length} item(s) matching '${elements.searchInput.value.trim()}'.`, 'info');
}

function showAllItems() {
  renderItems(inventory);
  showMessage(`Displaying all ${inventory.length} inventory item(s).`, 'info');
}

function showPopularItems() {
  const popularItems = inventory.filter((item) => item.popular);
  renderItems(popularItems);
  showMessage(`Displaying ${popularItems.length} popular item(s).`, 'info');
}

function bindEvents() {
  elements.addButton.addEventListener('click', addItem);
  elements.updateButton.addEventListener('click', updateItem);
  elements.deleteButton.addEventListener('click', deleteItem);
  elements.searchButton.addEventListener('click', searchItems);
  elements.showAllButton.addEventListener('click', showAllItems);
  elements.showPopularButton.addEventListener('click', showPopularItems);
}

function initialize() {
  bindEvents();
  renderItems(inventory);
  showMessage('Ready to manage inventory. Use the form to add, update, or delete items.', 'info');
}

initialize();

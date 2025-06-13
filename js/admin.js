document.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('lofoUser');
  if (!userData) {
    window.location.href = 'login.html';
    return;
  }
  const user = JSON.parse(userData);
  if (user.role !== 'admin') {
    alert('Access denied. Admins only.');
    window.location.href = 'home.html';
    return;
  }

  const lostItemsList = document.getElementById('lostItemsList');
  const claimsList = document.getElementById('claimsList');
  const addItemBtn = document.getElementById('addItemBtn');
  const itemModal = document.getElementById('itemModal');
  const closeModal = document.getElementById('closeModal');
  const itemForm = document.getElementById('itemForm');
  const modalTitle = document.getElementById('modalTitle');

  let editingItemId = null;

  // Fetch and display lost items
  async function fetchLostItems() {
    try {
      const response = await fetch('http://localhost:3000/lost-items');
      if (!response.ok) throw new Error('Failed to fetch lost items');
      const items = await response.json();
      displayLostItems(items);
    } catch (error) {
      lostItemsList.innerHTML = '<p>Error loading lost items.</p>';
    }
  }

  // Display lost items with edit/delete buttons
  function displayLostItems(items) {
    lostItemsList.innerHTML = '';
    if (items.length === 0) {
      lostItemsList.innerHTML = '<p>No lost items found.</p>';
      return;
    }
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'admin-item';
      div.innerHTML = `
        <h4>${item.title} (${item.status})</h4>
        <p>${item.category || ''} - ${item.location || ''} - Lost on: ${item.date_lost || ''}</p>
        <p>${item.description || ''}</p>
        <button class="edit-btn" data-id="${item.id}">Edit</button>
        <button class="delete-btn" data-id="${item.id}">Delete</button>
      `;
      lostItemsList.appendChild(div);
    });

    // Attach event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteItem(btn.dataset.id));
    });
  }

  // Fetch and display claims
  async function fetchClaims() {
    try {
      const response = await fetch('http://localhost:3000/claims');
      if (!response.ok) throw new Error('Failed to fetch claims');
      const claims = await response.json();
      displayClaims(claims);
    } catch (error) {
      claimsList.innerHTML = '<p>Error loading claims.</p>';
    }
  }

  // Display claims with approve/reject buttons
  function displayClaims(claims) {
    claimsList.innerHTML = '';
    if (claims.length === 0) {
      claimsList.innerHTML = '<p>No claims found.</p>';
      return;
    }
    claims.forEach(claim => {
      const div = document.createElement('div');
      div.className = 'admin-claim';
      div.innerHTML = `
        <p>Claim ID: ${claim.id} - User: ${claim.username} - Item: ${claim.title} - Date: ${new Date(claim.claim_date).toLocaleString()} - Status: ${claim.status}</p>
        <button class="approve-btn" data-id="${claim.id}">Approve</button>
        <button class="reject-btn" data-id="${claim.id}">Reject</button>
      `;
      claimsList.appendChild(div);
    });

    // Attach event listeners
    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', () => updateClaimStatus(btn.dataset.id, 'approved'));
    });
    document.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', () => updateClaimStatus(btn.dataset.id, 'rejected'));
    });
  }

  // Open modal for adding new item
  addItemBtn.addEventListener('click', () => {
    editingItemId = null;
    modalTitle.textContent = 'Add Lost Item';
    itemForm.reset();
    itemModal.style.display = 'block';
  });

  // Close modal
  closeModal.addEventListener('click', () => {
    itemModal.style.display = 'none';
  });

  // Open modal for editing item
  async function openEditModal(id) {
    try {
      const response = await fetch(`http://localhost:3000/lost-items`);
      if (!response.ok) throw new Error('Failed to fetch lost items');
      const items = await response.json();
      const item = items.find(i => i.id == id);
      if (!item) {
        alert('Item not found');
        return;
      }
      editingItemId = id;
      modalTitle.textContent = 'Edit Lost Item';
      itemForm.itemId.value = item.id;
      itemForm.itemTitle.value = item.title || '';
      itemForm.itemCategory.value = item.category || '';
      itemForm.itemLocation.value = item.location || '';
      itemForm.itemDateLost.value = item.date_lost || '';
      itemForm.itemDescription.value = item.description || '';
      itemForm.itemImageUrl.value = item.image_url || '';
      itemForm.itemStatus.value = item.status || 'lost';
      itemModal.style.display = 'block';
    } catch (error) {
      alert('Error loading item data');
    }
  }

  // Delete item
  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`http://localhost:3000/lost-items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');
      alert('Item deleted successfully');
      fetchLostItems();
    } catch (error) {
      alert('Error deleting item');
    }
  }

  // Update claim status
  async function updateClaimStatus(id, status) {
    // For simplicity, this example does not implement claim status update API.
    alert(`Claim status update to "${status}" is not implemented yet.`);
  }

  // Handle form submit for add/edit item
  itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const itemData = {
      title: itemForm.itemTitle.value.trim(),
      category: itemForm.itemCategory.value,
      location: itemForm.itemLocation.value.trim(),
      date_lost: itemForm.itemDateLost.value,
      description: itemForm.itemDescription.value.trim(),
      image_url: itemForm.itemImageUrl.value.trim(),
      status: itemForm.itemStatus.value,
    };

    try {
      let response;
      if (editingItemId) {
        response = await fetch(`http://localhost:3000/lost-items/${editingItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
      } else {
        response = await fetch('http://localhost:3000/lost-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error: ' + (errorData.message || 'Failed to save item'));
        return;
      }
      alert('Item saved successfully');
      itemModal.style.display = 'none';
      fetchLostItems();
    } catch (error) {
      alert('Error saving item');
    }
  });

  // Initialize
  fetchLostItems();
  fetchClaims();
});

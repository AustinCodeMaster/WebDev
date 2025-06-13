document.addEventListener('DOMContentLoaded', () => {
  const usernameDisplay = document.getElementById('usernameDisplay');
  const itemsGrid = document.getElementById('itemsGrid');
  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categorySelect');
  const searchBtn = document.getElementById('searchBtn');

  let user = null;
  let lostItems = [];

  // Load user from localStorage
  function loadUser() {
    const userData = localStorage.getItem('lofoUser');
    if (userData) {
      user = JSON.parse(userData);
      usernameDisplay.textContent = user.username;
    } else {
      // Redirect to login if not logged in
      window.location.href = 'login.html';
    }
  }

  // Fetch lost items from backend
  async function fetchLostItems() {
    try {
      const response = await fetch('http://localhost:3000/lost-items');
      if (!response.ok) {
        throw new Error('Failed to fetch lost items');
      }
      lostItems = await response.json();
      displayItems(lostItems);
    } catch (error) {
      itemsGrid.innerHTML = '<p>Error loading lost items.</p>';
    }
  }

  // Display lost items in the grid
  function displayItems(items) {
    itemsGrid.innerHTML = '';
    if (items.length === 0) {
      itemsGrid.innerHTML = '<p>No lost items found.</p>';
      return;
    }
    items.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.className = 'item-card';

      const itemImage = document.createElement('div');
      itemImage.className = 'item-image';
      const img = document.createElement('img');
      img.src = item.image_url || 'images/default.jpg';
      img.alt = item.title;
      const statusSpan = document.createElement('span');
      statusSpan.className = 'status';
      statusSpan.textContent = item.status.charAt(0).toUpperCase() + item.status.slice(1);
      itemImage.appendChild(img);
      itemImage.appendChild(statusSpan);

      const itemInfo = document.createElement('div');
      itemInfo.className = 'item-info';
      itemInfo.innerHTML = `
        <h3>${item.title}</h3>
        <p class="category">${item.category || ''}</p>
        <p class="location"><i class="fas fa-map-marker-alt"></i> ${item.location || ''}</p>
        <p class="date"><i class="far fa-calendar-alt"></i> Lost on: ${item.date_lost || ''}</p>
        <p class="description">${item.description || ''}</p>
      `;

      const claimBtn = document.createElement('button');
      claimBtn.className = 'contact-btn';
      claimBtn.textContent = 'Claim Item';
      claimBtn.addEventListener('click', () => claimItem(item.id));

      itemInfo.appendChild(claimBtn);

      itemCard.appendChild(itemImage);
      itemCard.appendChild(itemInfo);

      itemsGrid.appendChild(itemCard);
    });
  }

  // Claim an item
  async function claimItem(itemId) {
    if (!user) {
      alert('Please login to claim items.');
      window.location.href = 'login.html';
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, lost_item_id: itemId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error: ' + (errorData.message || 'Failed to claim item'));
        return;
      }
      alert('Claim submitted successfully.');
    } catch (error) {
      alert('Error submitting claim.');
    }
  }

  // Search functionality
  function filterItems() {
    const searchText = searchInput.value.toLowerCase();
    const category = categorySelect.value.toLowerCase();

    const filtered = lostItems.filter(item => {
      const matchesText = item.title.toLowerCase().includes(searchText) || (item.description && item.description.toLowerCase().includes(searchText));
      const matchesCategory = category === '' || (item.category && item.category.toLowerCase() === category);
      return matchesText && matchesCategory;
    });
    displayItems(filtered);
  }

  searchBtn.addEventListener('click', filterItems);

  // Initialize
  loadUser();
  fetchLostItems();
});

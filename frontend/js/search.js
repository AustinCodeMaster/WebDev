document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const categorySelect = document.querySelector('.category-select');
    const searchBtn = document.querySelector('.search-btn');
    const itemsGrid = document.querySelector('.items-grid');
    const itemCards = document.querySelectorAll('.item-card');
    
    // Add advanced search controls
    const advancedSearchHTML = `
        <div class="advanced-search">
            <div class="search-filters">
                <select class="location-select">
                    <option value="">All Locations</option>
                    <option value="library">Library</option>
                    <option value="science lab">Science Lab</option>
                    <option value="student center">Student Center</option>
                    <option value="engineering">Engineering Block</option>
                    <option value="dormitory">Dormitory</option>
                    <option value="gym">Gym</option>
                </select>
                <select class="date-select">
                    <option value="">Any Date</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                </select>
                <button class="advanced-toggle">Advanced Filters</button>
            </div>
            <div class="advanced-filters" style="display: none;">
                <label>
                    <input type="checkbox" class="found-only"> Show Found Items Only
                </label>
                <label>
                    <input type="checkbox" class="with-image"> Items with Images Only
                </label>
            </div>
        </div>
    `;
    
    // Insert advanced search controls after the main search
    searchInput.parentElement.insertAdjacentHTML('afterend', advancedSearchHTML);    // Function to check if date is within range
    function isDateInRange(dateStr, range) {
        const itemDate = new Date(dateStr.match(/June \d+, 2025/)[0]);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        switch(range) {
            case 'today':
                return itemDate.toDateString() === today.toDateString();
            case 'yesterday':
                return itemDate.toDateString() === yesterday.toDateString();
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return itemDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return itemDate >= monthAgo;
            default:
                return true;
        }
    }

    // Function to filter items
    function filterItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value.toLowerCase();
        const selectedLocation = document.querySelector('.location-select').value.toLowerCase();
        const selectedDate = document.querySelector('.date-select').value;
        const foundOnly = document.querySelector('.found-only')?.checked || false;
        const withImage = document.querySelector('.with-image')?.checked || false;

        itemCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.description').textContent.toLowerCase();
            const category = card.querySelector('.category').textContent.toLowerCase();
            const location = card.querySelector('.location').textContent.toLowerCase();
            const dateText = card.querySelector('.date').textContent;
            const status = card.querySelector('.status').textContent.toLowerCase();
            const hasImage = card.querySelector('.item-image img').src !== '';
            
            const matchesSearch = title.includes(searchTerm) || 
                                description.includes(searchTerm);
            const matchesCategory = selectedCategory === '' || 
                                  category.includes(selectedCategory);
            const matchesLocation = selectedLocation === '' ||
                                  location.includes(selectedLocation);
            const matchesDate = selectedDate === '' ||
                              isDateInRange(dateText, selectedDate);
            const matchesStatus = !foundOnly || status === 'found';
            const matchesImage = !withImage || hasImage;            if (matchesSearch && 
                matchesCategory && 
                matchesLocation && 
                matchesDate && 
                matchesStatus && 
                matchesImage) {
                card.style.display = 'block';
                // Add animation for appearing items
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        });

        // Show "No items found" message if no results
        const visibleItems = document.querySelectorAll('.item-card[style="display: block"]');
        const noResultsMsg = document.querySelector('.no-results');
        
        if (visibleItems.length === 0) {
            if (!noResultsMsg) {
                const message = document.createElement('p');
                message.className = 'no-results';
                message.textContent = 'No items found matching your search.';
                message.style.textAlign = 'center';
                message.style.color = '#666';
                message.style.padding = '20px';
                itemsGrid.appendChild(message);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }    // Real-time search as user types
    searchInput.addEventListener('input', filterItems);
    categorySelect.addEventListener('change', filterItems);
    
    // Advanced search listeners
    document.querySelector('.location-select').addEventListener('change', filterItems);
    document.querySelector('.date-select').addEventListener('change', filterItems);
    document.querySelector('.found-only').addEventListener('change', filterItems);
    document.querySelector('.with-image').addEventListener('change', filterItems);
    
    // Advanced filters toggle
    document.querySelector('.advanced-toggle').addEventListener('click', function() {
        const advancedFilters = document.querySelector('.advanced-filters');
        advancedFilters.style.display = advancedFilters.style.display === 'none' ? 'flex' : 'none';
        this.textContent = advancedFilters.style.display === 'none' ? 'Advanced Filters' : 'Hide Filters';
    });
    
    // Search button click
    searchBtn.addEventListener('click', filterItems);

    // Add transition effects to cards
    itemCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
});

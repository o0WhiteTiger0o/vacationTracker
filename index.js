// Sample data for the application
const vacationData = {
    attractions: [
        {
            id: 1,
            name: "Eiffel Tower",
            description: "Iconic iron tower offering panoramic views of Paris from its observation decks.",
            image: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
            rating: 4.8,
            price: 3,
            address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
            hours: "9:00 AM - 11:45 PM",
            phone: "+33 892 70 12 39",
            website: "https://www.toureiffel.paris",
            location: { lat: 48.8584, lng: 2.2945 },
            category: "attractions"
        },
        {
            id: 2,
            name: "Central Park",
            description: "Massive urban park with playgrounds, zoos, ice rinks & concerts areas.",
            image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
            rating: 4.7,
            price: 0,
            address: "New York, NY 10024, United States",
            hours: "6:00 AM - 1:00 AM",
            phone: "+1 212-310-6600",
            website: "https://www.centralparknyc.org",
            location: { lat: 40.7829, lng: -73.9654 },
            category: "attractions"
        }
    ],
    restaurants: [
        {
            id: 101,
            name: "The French Laundry",
            description: "High-end, French-inspired cuisine served in a historic stone cottage with a courtyard.",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            rating: 4.9,
            price: 5,
            address: "6640 Washington St, Yountville, CA 94599, United States",
            hours: "11:00 AM - 9:00 PM",
            phone: "+1 707-944-2380",
            website: "https://www.thomaskeller.com/tfl",
            location: { lat: 38.4036, lng: -122.3621 },
            category: "restaurants"
        },
        {
            id: 102,
            name: "Gaggan Anand",
            description: "Innovative Indian tasting menus with molecular gastronomy techniques in a stylish setting.",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
            rating: 4.8,
            price: 4,
            address: "68/1 Soi Langsuan, Ploenchit Road, Lumpini, Bangkok 10330, Thailand",
            hours: "6:00 PM - 11:00 PM",
            phone: "+66 2 652 1700",
            website: "https://www.gaggananand.com",
            location: { lat: 13.7366, lng: 100.5471 },
            category: "restaurants"
        }
    ],
    stays: [
        {
            id: 201,
            name: "Burj Al Arab Jumeirah",
            description: "Luxury hotel with ultramodern design, featuring suites with butler service, 9 restaurants & a private beach.",
            image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
            rating: 4.9,
            price: 5,
            address: "Jumeirah St - Dubai - United Arab Emirates",
            hours: "Check-in: 3:00 PM, Check-out: 12:00 PM",
            phone: "+971 4 301 7777",
            website: "https://www.jumeirah.com/en/stay/dubai/burj-al-arab-jumeirah",
            location: { lat: 25.1412, lng: 55.1852 },
            category: "stays"
        },
        {
            id: 202,
            name: "Bambu Indah",
            description: "Eco-chic resort featuring rustic-chic bamboo villas with plunge pools, plus a restaurant & spa.",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
            rating: 4.7,
            price: 3,
            address: "Jl. Baung, Sayan, Kec. Ubud, Kabupaten Gianyar, Bali 80571, Indonesia",
            hours: "Check-in: 2:00 PM, Check-out: 12:00 PM",
            phone: "+62 361 977922",
            website: "https://www.bambuindah.com",
            location: { lat: -8.5069, lng: 115.2455 },
            category: "stays"
        }
    ]
};

// Global variables
let currentLocation = null;
let map;
let markers = [];
let currentItems = [];
let selectedMapProvider = 'google';

// DOM elements
const itemsContainer = document.getElementById('items-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryLinks = document.querySelectorAll('nav ul li a');
const sortBySelect = document.getElementById('sort-by');
const priceFilter = document.getElementById('price-filter');
const priceValue = document.getElementById('price-value');
const locateMeBtn = document.getElementById('locate-me');
const mapProviderSelect = document.getElementById('map-provider');
const modal = document.getElementById('item-modal');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const modalRating = document.getElementById('modal-rating');
const modalPrice = document.getElementById('modal-price');
const modalAddress = document.getElementById('modal-address');
const modalHours = document.getElementById('modal-hours');
const modalPhone = document.getElementById('modal-phone');
const modalWebsite = document.getElementById('modal-website');
const navigateBtn = document.getElementById('navigate-btn');
const saveBtn = document.getElementById('save-btn');

// Current filter state
let currentFilter = {
    category: 'all',
    searchQuery: '',
    priceRange: 5,
    sortBy: 'rating'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Combine all data
    currentItems = [
        ...vacationData.attractions,
        ...vacationData.restaurants,
        ...vacationData.stays
    ];
    
    // Initial render
    renderItems(currentItems);
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize map (Google Maps API callback)
    if (typeof google !== 'undefined') {
        initMap();
    }
});

// Initialize Google Maps
function initMap() {
    // Default location (Paris)
    const defaultLocation = { lat: 48.8566, lng: 2.3522 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 2,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    { "visibility": "off" }
                ]
            }
        ]
    });
    
    // Add markers for all items
    updateMapMarkers(currentItems);
    
    // Try to get user's current location
    locateUser();
}

function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Category filtering
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentFilter.category = link.dataset.category;
            filterItems();
        });
    });
    
    // Sorting and filtering
    sortBySelect.addEventListener('change', () => {
        currentFilter.sortBy = sortBySelect.value;
        filterItems();
    });
    
    priceFilter.addEventListener('input', () => {
        currentFilter.priceRange = parseInt(priceFilter.value);
        priceValue.textContent = '$'.repeat(currentFilter.priceRange);
        filterItems();
    });
    
    // Location services
    locateMeBtn.addEventListener('click', locateUser);
    
    // Map provider selection
    mapProviderSelect.addEventListener('change', () => {
        selectedMapProvider = mapProviderSelect.value;
    });
    
    // Modal functionality
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Navigation button
    navigateBtn.addEventListener('click', navigateToDestination);
    
    // Save button
    saveBtn.addEventListener('click', saveItem);
}

function handleSearch() {
    currentFilter.searchQuery = searchInput.value.trim().toLowerCase();
    filterItems();
}

function filterItems() {
    let filteredItems = [...currentItems];
    
    // Filter by category
    if (currentFilter.category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === currentFilter.category);
    }
    
    // Filter by search query
    if (currentFilter.searchQuery) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(currentFilter.searchQuery) ||
            item.description.toLowerCase().includes(currentFilter.searchQuery) ||
            item.address.toLowerCase().includes(currentFilter.searchQuery)
        );
    }
    
    // Filter by price
    filteredItems = filteredItems.filter(item => item.price <= currentFilter.priceRange);
    
    // Sort items
    filteredItems.sort((a, b) => {
        if (currentFilter.sortBy === 'rating') {
            return b.rating - a.rating;
        } else if (currentFilter.sortBy === 'price') {
            return a.price - b.price;
        } else if (currentFilter.sortBy === 'distance' && currentLocation) {
            const distA = calculateDistance(currentLocation, a.location);
            const distB = calculateDistance(currentLocation, b.location);
            return distA - distB;
        }
        return 0;
    });
    
    renderItems(filteredItems);
    updateMapMarkers(filteredItems);
}

function renderItems(items) {
    itemsContainer.innerHTML = '';
    
    if (items.length === 0) {
        itemsContainer.innerHTML = '<p class="no-results">No items found matching your criteria.</p>';
        return;
    }
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.dataset.id = item.id;
        
        // Get category icon and label
        let categoryIcon, categoryLabel;
        switch(item.category) {
            case 'attractions':
                categoryIcon = 'fa-camera';
                categoryLabel = 'Attraction';
                break;
            case 'restaurants':
                categoryIcon = 'fa-utensils';
                categoryLabel = 'Restaurant';
                break;
            case 'stays':
                categoryIcon = 'fa-hotel';
                categoryLabel = 'Stay';
                break;
        }
        
        itemCard.innerHTML = `
            <div class="item-image" style="background-image: url('${item.image}')">
                <span class="category-badge"><i class="fas ${categoryIcon}"></i> ${categoryLabel}</span>
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="item-info">
                    <div class="rating">${generateStarRating(item.rating)}</div>
                    <div class="price">${'$'.repeat(item.price)}</div>
                </div>
                <p class="item-address">${item.address}</p>
            </div>
        `;
        
        itemCard.addEventListener('click', () => openItemModal(item));
        itemsContainer.appendChild(itemCard);
    });
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        <span>${rating.toFixed(1)}</span>
    `;
}

function updateMapMarkers(items) {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    // Add new markers
    items.forEach(item => {
        const marker = new google.maps.Marker({
            position: item.location,
            map: map,
            title: item.name,
            icon: getMarkerIcon(item.category)
        });
        
        marker.addListener('click', () => {
            openItemModal(item);
        });
        
        markers.push(marker);
    });
    
    // Adjust map bounds to show all markers
    if (items.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        items.forEach(item => bounds.extend(item.location));
        
        // If we have user location, include it in the bounds
        if (currentLocation) {
            bounds.extend(currentLocation);
        }
        
        map.fitBounds(bounds);
    }
}

function getMarkerIcon(category) {
    const icons = {
        attractions: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            size: new google.maps.Size(32, 32),
            scaledSize: new google.maps.Size(32, 32)
        },
        restaurants: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            size: new google.maps.Size(32, 32),
            scaledSize: new google.maps.Size(32, 32)
        },
        stays: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            size: new google.maps.Size(32, 32),
            scaledSize: new google.maps.Size(32, 32)
        }
    };
    return icons[category] || {
        url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        size: new google.maps.Size(32, 32),
        scaledSize: new google.maps.Size(32, 32)
    };
}

function openItemModal(item) {
    modalTitle.textContent = item.name;
    modalImage.style.backgroundImage = `url('${item.image}')`;
    modalDescription.textContent = item.description;
    modalRating.innerHTML = generateStarRating(item.rating);
    modalPrice.textContent = `${'$'.repeat(item.price)}`;
    modalAddress.textContent = item.address;
    modalHours.textContent = item.hours;
    modalPhone.textContent = item.phone || 'Not available';
    modalWebsite.href = item.website;
    modalWebsite.textContent = item.website || 'Not available';
    
    // Store current item for navigation
    navigateBtn.dataset.item = JSON.stringify(item);
    
    modal.style.display = 'block';
}

function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Update map center
                map.setCenter(currentLocation);
                map.setZoom(12);
                
                // Add user marker
                addUserMarker(currentLocation);
                
                // Re-sort items by distance if that's the current sort
                if (currentFilter.sortBy === 'distance') {
                    filterItems();
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location. Using default location.');
                
                // Use a default location if geolocation fails
                currentLocation = { lat: 48.8566, lng: 2.3522 }; // Paris
                map.setCenter(currentLocation);
                map.setZoom(12);
                addUserMarker(currentLocation);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function addUserMarker(position) {
    // Remove any existing user marker
    markers.forEach(marker => {
        if (marker.isUserLocation) {
            marker.setMap(null);
        }
    });
    
    // Add new user marker
    const userMarker = new google.maps.Marker({
        position: position,
        map: map,
        title: 'Your Location',
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40)
        },
        isUserLocation: true
    });
    
    markers.push(userMarker);
}

function navigateToDestination() {
    const item = JSON.parse(navigateBtn.dataset.item);
    
    if (!currentLocation) {
        alert('Please allow location access to use navigation.');
        return;
    }
    
    const destination = `${item.location.lat},${item.location.lng}`;
    const origin = `${currentLocation.lat},${currentLocation.lng}`;
    
    if (selectedMapProvider === 'google') {
        // Open Google Maps
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`);
    } else {
        // Open Apple Maps (works on iOS devices)
        window.open(`http://maps.apple.com/?daddr=${destination}&dirflg=d`);
    }
}

function saveItem() {
    const item = JSON.parse(navigateBtn.dataset.item);
    
    // In a real app, this would save to localStorage or a backend
    alert(`Saved "${item.name}" to your favorites!`);
    
    // Change button appearance temporarily
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
    saveBtn.style.backgroundColor = '#00b894';
    saveBtn.style.color = 'white';
    
    setTimeout(() => {
        saveBtn.innerHTML = '<i class="far fa-bookmark"></i> Save';
        saveBtn.style.backgroundColor = '#dfe6e9';
        saveBtn.style.color = '#2d3436';
    }, 2000);
}

function calculateDistance(location1, location2) {
    // Haversine formula to calculate distance between two coordinates
    const R = 6371; // Earth radius in km
    const dLat = deg2rad(location2.lat - location1.lat);
    const dLon = deg2rad(location2.lng - location1.lng);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(location1.lat)) * Math.cos(deg2rad(location2.lat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}
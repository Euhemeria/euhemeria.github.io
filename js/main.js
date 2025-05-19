// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile navigation toggle (to be implemented)
function toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Add mobile navigation button
const nav = document.querySelector('nav');
const mobileNavButton = document.createElement('button');
mobileNavButton.classList.add('mobile-nav-toggle');
mobileNavButton.innerHTML = '<i class="fas fa-bars"></i>';
mobileNavButton.addEventListener('click', toggleMobileNav);
nav.appendChild(mobileNavButton);

// Update copyright year automatically
document.querySelector('footer p').innerHTML = 
    `&copy; ${new Date().getFullYear()} Euhemeria. Todos los derechos reservados.`;

// Gallery logic for random 3-image display
document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.post-gallery');
    if (!galleryContainer) return;

    // Get all gallery items as a static array of data (only src and alt)
    const allGalleryItemsData = Array.from(galleryContainer.children).map(item => ({
        src: item.querySelector('img').getAttribute('src'),
        alt: item.querySelector('img').getAttribute('alt'),
        // Caption is removed
    }));

    // Clear existing items from the HTML container to make space for the 3 display slots
    galleryContainer.innerHTML = '';

    // Create 3 fixed slots in the HTML container
    for (let i = 0; i < 3; i++) {
        const newItem = document.createElement('div');
        newItem.classList.add('gallery-item', 'active-display'); // Add 'active-display' class for styling
        newItem.innerHTML = `
            <img src="" alt="" />
        `; // Removed caption div
        galleryContainer.appendChild(newItem);
    }

    const displayItems = galleryContainer.querySelectorAll('.gallery-item.active-display');

    // Function to select and display 3 random unique items
    const selectAndDisplayRandomPosts = () => {
        // Shuffle the data array
        const shuffledData = [...allGalleryItemsData].sort(() => 0.5 - Math.random());

        // Select the first 3 unique items
        const selectedItems = shuffledData.slice(0, 3);

        // Update the display slots with selected items
        displayItems.forEach((displayItem, index) => {
            if (selectedItems[index]) {
                displayItem.querySelector('img').setAttribute('src', selectedItems[index].src);
                displayItem.querySelector('img').setAttribute('alt', selectedItems[index].alt);
                // Caption update is removed
                displayItem.style.display = 'flex'; // Make sure it's visible
            } else {
                 displayItem.style.display = 'none'; // Hide if less than 3 items
            }
        });
    };

    // Initial display
    selectAndDisplayRandomPosts();

    // Change items every 3 seconds
    setInterval(selectAndDisplayRandomPosts, 3000);
}); 

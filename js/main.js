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
    `&copy; ${new Date().getFullYear()} Euhemeria. No tenemos derechos xd.`;

// Gallery logic for random 3-image display with fade animation
document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.post-gallery');
    if (!galleryContainer) return;

    // Get all gallery items as a static array of data (only src and alt)
    const allGalleryItemsData = Array.from(galleryContainer.children).map(item => ({
        src: item.querySelector('img').getAttribute('src'),
        alt: item.querySelector('img').getAttribute('alt'),
    }));

    // Clear existing items from the HTML container and create 3 fixed slots
    galleryContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const newItem = document.createElement('div');
        newItem.classList.add('gallery-item', 'active-display');
        newItem.innerHTML = `<img src="" alt="" />`;
        galleryContainer.appendChild(newItem);
    }

    const displayItems = galleryContainer.querySelectorAll('.gallery-item.active-display');

    // Track which images are being hovered
    const hoveredIndexes = new Set();
    displayItems.forEach((displayItem, index) => {
        displayItem.addEventListener('mouseenter', () => hoveredIndexes.add(index));
        displayItem.addEventListener('mouseleave', () => hoveredIndexes.delete(index));
    });

    // Store the last shown items
    let lastShownItems = [];

    // Function to select and display 3 random unique items with fade animation
    const selectAndDisplayRandomPosts = () => {
        // Exclude last shown items from the pool
        const availableData = allGalleryItemsData.filter(item => !lastShownItems.includes(item.src));
        // Shuffle the available data array
        const shuffledData = [...availableData].sort(() => 0.5 - Math.random());
        // Select the first 3 unique items
        let selectedItems = shuffledData.slice(0, 3);

        // If not enough items, allow previously shown items to fill the rest
        if (selectedItems.length < 3) {
            // Get the missing count
            const missingCount = 3 - selectedItems.length;
            // Get the rest from lastShownItems (shuffle for randomness)
            const lastShownData = allGalleryItemsData.filter(item => lastShownItems.includes(item.src)).sort(() => 0.5 - Math.random());
            selectedItems = selectedItems.concat(lastShownData.slice(0, missingCount));
        }

        // Apply fade-out animation
        displayItems.forEach((item, index) => {
            // Only animate if not hovered
            if (!hoveredIndexes.has(index)) {
                const img = item.querySelector('img');
                img.classList.remove('fade-in');
                img.classList.add('fade-out');
            }
        });

        // Wait for fade-out to complete, then update content and fade in
        setTimeout(() => {
            displayItems.forEach((displayItem, index) => {
                // Only update if not hovered
                if (!hoveredIndexes.has(index)) {
                    const img = displayItem.querySelector('img');
                    if (selectedItems[index]) {
                        img.setAttribute('src', selectedItems[index].src);
                        img.setAttribute('alt', selectedItems[index].alt);
                        // Remove fade-out and add fade-in
                        img.classList.remove('fade-out');
                        img.classList.add('fade-in');
                        displayItem.style.display = 'flex'; // Ensure display is correct
                    } else {
                        displayItem.style.display = 'none'; // Hide if less than 3 items
                    }
                }
            });
            // Update lastShownItems for the next cycle (use current images in DOM)
            lastShownItems = Array.from(displayItems).map(displayItem => displayItem.querySelector('img').getAttribute('src'));
        }, 500); // Matches fade-out animation duration (0.5s)
    };

    // Initial display
    selectAndDisplayRandomPosts();

    // Change items every 5 seconds (including the fade time)
    setInterval(selectAndDisplayRandomPosts, 5000);
}); 

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

// Gallery logic for random 3-image display with pop-in/pop-out animation
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

    // Track which images are being hovered (by src)
    let hoveredSrcs = new Set();
    displayItems.forEach((displayItem, index) => {
        const img = displayItem.querySelector('img');
        displayItem.addEventListener('mouseenter', () => {
            if (img.getAttribute('src')) hoveredSrcs.add(img.getAttribute('src'));
        });
        displayItem.addEventListener('mouseleave', () => {
            if (img.getAttribute('src')) hoveredSrcs.delete(img.getAttribute('src'));
        });
    });

    // Store the last shown items
    let lastShownItems = [];

    // Function to select and display 3 random unique items with pop-in/pop-out animation
    const selectAndDisplayRandomPosts = () => {
        // Exclude last shown items and hovered images from the pool
        const availableData = allGalleryItemsData.filter(item => !lastShownItems.includes(item.src) && !hoveredSrcs.has(item.src));
        // Shuffle the available data array
        const shuffledData = [...availableData].sort(() => 0.5 - Math.random());
        // Select the first 3 unique items
        let selectedItems = shuffledData.slice(0, 3);

        // If not enough items, allow previously shown items (but still not hovered) to fill the rest
        if (selectedItems.length < 3) {
            const missingCount = 3 - selectedItems.length;
            const lastShownData = allGalleryItemsData.filter(item => lastShownItems.includes(item.src) && !hoveredSrcs.has(item.src)).sort(() => 0.5 - Math.random());
            selectedItems = selectedItems.concat(lastShownData.slice(0, missingCount));
        }

        // If still not enough (e.g. user is hovering over 2+ images), fill with hovered images in their current slot
        if (selectedItems.length < 3) {
            const currentImages = Array.from(displayItems).map(displayItem => displayItem.querySelector('img').getAttribute('src'));
            const hoveredFill = currentImages.filter(src => hoveredSrcs.has(src) && !selectedItems.some(item => item && item.src === src));
            selectedItems = selectedItems.concat(hoveredFill.slice(0, 3 - selectedItems.length).map(src => ({src, alt: ''})));
        }

        // Play pop-out animation for images that will be replaced (not hovered)
        displayItems.forEach((item, index) => {
            if (!hoveredSrcs.has(selectedItems[index].src)) {
                const img = item.querySelector('img');
                img.classList.remove('pop-in');
                img.classList.add('pop-out');
            }
        });

        // Wait for pop-out to complete (0.2s), then leave grid empty for 0.05s, then pop-in new image (total 0.25s delay)
        setTimeout(() => {
            displayItems.forEach((displayItem, index) => {
                if (!hoveredSrcs.has(selectedItems[index].src)) {
                    const img = displayItem.querySelector('img');
                    // Hide image for 0.05s
                    img.style.opacity = '0';
                    setTimeout(() => {
                        // Set new image src/alt
                        if (selectedItems[index]) {
                            img.setAttribute('src', selectedItems[index].src);
                            img.setAttribute('alt', selectedItems[index].alt);
                            img.classList.remove('pop-out');
                            img.classList.add('pop-in');
                            img.style.opacity = '';
                            displayItem.style.display = 'flex';
                        } else {
                            displayItem.style.display = 'none';
                        }
                    }, 50); // 0.05s empty
                }
            });
            // Update lastShownItems for the next cycle (use current images in DOM)
            lastShownItems = Array.from(displayItems).map(displayItem => displayItem.querySelector('img').getAttribute('src'));
        }, 200); // 0.2s pop-out
    };

    // Initial display
    selectAndDisplayRandomPosts();

    // Change items every 5 seconds (including the fade time)
    setInterval(selectAndDisplayRandomPosts, 5000);
}); 

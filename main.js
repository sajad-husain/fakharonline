// Fakhar Online - Main JavaScript File

// Global variables
let cart = JSON.parse(localStorage.getItem('fakharCart')) || [];
let cartTotal = 0;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCarousel();
    initializeSeasonalCalendar();
    initializeCart();
    initializeScrollReveal();
    initializeTypedText();
});

// Initialize animations
function initializeAnimations() {
    // Animate floating elements
    anime({
        targets: '.floating',
        translateY: [-10, 10],
        duration: 3000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
        delay: function(el, i) { return i * 500; }
    });
}

// Initialize typed text effect
function initializeTypedText() {
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Taste the Sunshine of Pakistan',
                'Farm-Fresh Mangoes & Kinnow',
                'Authentic Pakistani Heritage'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Initialize product carousel
function initializeCarousel() {
    if (document.getElementById('product-carousel')) {
        new Splide('#product-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            breakpoints: {
                1024: {
                    perPage: 2,
                },
                640: {
                    perPage: 1,
                }
            }
        }).mount();
    }
}

// Initialize seasonal calendar
function initializeSeasonalCalendar() {
    if (document.getElementById('seasonal-calendar')) {
        const calendarChart = echarts.init(document.getElementById('seasonal-calendar'));
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const fruits = ['Chaunsa Mango', 'Anwar Ratol', 'Sindhri Mango', 'Kinnow'];
        
        const data = [];
        // Chaunsa Mango - Peak in July-September
        data.push([0, 6, 9]); data.push([0, 7, 10]); data.push([0, 8, 8]);
        // Anwar Ratol - Peak in June-July
        data.push([1, 5, 8]); data.push([1, 6, 9]); data.push([1, 7, 7]);
        // Sindhri Mango - Peak in May-June
        data.push([2, 4, 9]); data.push([2, 5, 10]); data.push([2, 6, 6]);
        // Kinnow - Peak in December-February
        data.push([3, 0, 8]); data.push([3, 1, 10]); data.push([3, 11, 9]);
        
        const option = {
            tooltip: {
                position: 'top',
                formatter: function(params) {
                    return fruits[params.data[0]] + ' in ' + months[params.data[1]] + ': ' + params.data[2] + '/10 availability';
                }
            },
            grid: {
                height: '50%',
                top: '10%'
            },
            xAxis: {
                type: 'category',
                data: months,
                splitArea: {
                    show: true
                }
            },
            yAxis: {
                type: 'category',
                data: fruits,
                splitArea: {
                    show: true
                }
            },
            visualMap: {
                min: 0,
                max: 10,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%',
                inRange: {
                    color: ['#FFF8E1', '#FFB300', '#FF6B35']
                }
            },
            series: [{
                name: 'Seasonal Availability',
                type: 'heatmap',
                data: data,
                label: {
                    show: true
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        
        calendarChart.setOption(option);
        
        // Make chart responsive
        window.addEventListener('resize', function() {
            calendarChart.resize();
        });
    }
}

// Initialize scroll reveal animations
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Cart functionality
function initializeCart() {
    updateCartDisplay();
    
    // Cart button event listeners
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    document.getElementById('checkout-btn').addEventListener('click', proceedToCheckout);
}

// Add to cart function
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('fakharCart', JSON.stringify(cart));
    updateCartDisplay();
    
    // Show success notification
    showNotification(`${name} added to cart!`, 'success');
    
    // Animate cart icon
    anime({
        targets: '#cart-btn',
        scale: [1, 1.2, 1],
        duration: 300,
        easing: 'easeInOutQuad'
    });
}

// Remove from cart function
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('fakharCart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('Item removed from cart', 'info');
}

// Update cart quantity
function updateQuantity(id, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(id);
        return;
    }
    
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('fakharCart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Calculate total items and price
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty</p>';
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex items-center space-x-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${item.name}</h4>
                    <p class="text-orange-500 font-bold">₨${item.price}</p>
                    <div class="flex items-center space-x-2 mt-2">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                                class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                            -
                        </button>
                        <span class="w-8 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" 
                                class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                            +
                        </button>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        `).join('');
        
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    // Update total
    cartTotalElement.textContent = `₨${cartTotal.toLocaleString()}`;
}

// Open cart sidebar
function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.remove('translate-x-full');
    cartOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close cart sidebar
function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // For demo purposes, just show a success message
    showNotification('Redirecting to checkout...', 'success');
    
    // In a real application, this would redirect to a checkout page
    setTimeout(() => {
        alert('Thank you for your interest! This is a demo version. In a real application, this would proceed to payment processing.');
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
    
    // Set notification style based on type
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle mobile menu (if needed)
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Handle form submissions (if any forms are added)
function handleFormSubmit(form) {
    // Prevent default form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        showNotification('Form submitted successfully!', 'success');
        
        // Reset form
        form.reset();
    });
}

// Initialize any forms on the page
document.querySelectorAll('form').forEach(handleFormSubmit);

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Close cart on mobile resize
    if (window.innerWidth < 768) {
        closeCart();
    }
});

// Handle page visibility change for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        anime.running.forEach(animation => animation.pause());
    } else {
        // Resume animations when page becomes visible
        anime.running.forEach(animation => animation.play());
    }
});

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openCart = openCart;
window.closeCart = closeCart;
window.toggleMobileMenu = toggleMobileMenu;
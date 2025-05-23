document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Product Data
    const products = [
        {
            id: 1,
            name: 'Sourdough Bread',
            price: 5.99,
            category: 'bread',
            image: 'https://images.unsplash.com/photo-1595535873420-a599195b3f4a',
            description: 'Traditional sourdough with crispy crust'
        },
        {
            id: 2,
            name: 'Chocolate Croissant',
            price: 3.50,
            category: 'pastry',
            image: 'https://images.unsplash.com/photo-1620146344904-097a0002d797',
            description: 'Buttery croissant with rich chocolate filling'
        },
        {
            id: 3,
            name: 'Red Velvet Cake',
            price: 24.99,
            category: 'cake',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
            description: 'Classic red velvet with cream cheese frosting'
        },
        {
            id: 4,
            name: 'Chocolate Chip Cookies',
            price: 2.99,
            category: 'cookie',
            image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35',
            description: 'Soft and chewy with melty chocolate chips'
        },
        {
            id: 5,
            name: 'Baguette',
            price: 3.25,
            category: 'bread',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
            description: 'Traditional French baguette'
        },
        {
            id: 6,
            name: 'Cinnamon Roll',
            price: 4.25,
            category: 'pastry',
            image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
            description: 'Sweet and gooey with cream cheese icing'
        },
        {
            id: 7,
            name: 'Carrot Cake',
            price: 22.99,
            category: 'cake',
            image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d',
            description: 'Moist carrot cake with walnuts and cream cheese frosting'
        },
        {
            id: 8,
            name: 'Macarons',
            price: 2.50,
            category: 'cookie',
            image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b',
            description: 'French macarons in assorted flavors'
        }
    ];
  
    // Display Products
    const productGrid = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    function displayProducts(filter = 'all') {
        productGrid.innerHTML = '';
        
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(product => product.category === filter);
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
        
        // Add event listeners to add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', addToCart);
        });
    }
    
    // Filter Products
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter products
            const filter = this.getAttribute('data-filter');
            displayProducts(filter);
        });
    });
    
    // Initialize with all products
    displayProducts();
    
    // Cart Functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = count;
    }
    
    // Add to cart
    function addToCart(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Cart Modal
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');
    
    // Open cart modal
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'flex';
        displayCartItems();
    });
    
    // Close cart modal
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Display cart items
    function displayCartItems() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </div>
            `;
            cartItems.appendChild(cartItem);
            
            total += item.price * item.quantity;
        });
        
        cartTotal.textContent = total.toFixed(2);
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', updateQuantity);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
    }
    
    // Update quantity
    function updateQuantity(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        
        if (e.currentTarget.classList.contains('minus')) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Remove item if quantity is 0
                cart = cart.filter(item => item.id !== productId);
            }
        } else if (e.currentTarget.classList.contains('plus')) {
            item.quantity += 1;
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart display
        displayCartItems();
        updateCartCount();
    }
    
    // Remove item
    function removeItem(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        cart = cart.filter(item => item.id !== productId);
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart display
        displayCartItems();
        updateCartCount();
        
        // Show notification
        showNotification('Item removed from cart');
    }
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert('Thank you for your order!');
        cart = [];
        localStorage.removeItem('cart');
        displayCartItems();
        updateCartCount();
        cartModal.style.display = 'none';
    });
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // Auto slide
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Contact Form
    const contactForm = document.getElementById('message-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the data to a server
        console.log({ name, email, subject, message });
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
    
    // Initialize cart count
    updateCartCount();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#cart') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add notification styles dynamically
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        box-shadow: var(--box-shadow);
        z-index: 3000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .notification.show {
        opacity: 1;
    }
`;
document.head.appendChild(style);

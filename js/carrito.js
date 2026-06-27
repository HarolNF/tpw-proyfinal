// Carrito almacenado en memoria
let cart = [];

// Cargar carrito al inicio
function loadCart() {
    const savedCart = localStorage.getItem('construmartCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        // Si no hay nada guardado, el carrito es un arreglo vacío
        cart = [];
    }
    updateCartDisplay();
    updateCartCount();
}

// Agregar producto al carrito
function addToCart(product) {
    console.log('Agregando producto:', product);

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Limpiar ruta de imagen para que sea relativa al root (assets/img/...)
        let imagePath = product.image;
        if (imagePath.startsWith('../')) {
            imagePath = imagePath.substring(3);
        } else if (imagePath.startsWith('img/')) {
            // Si viene como img/ (legacy), lo cambiamos a assets/img/
            imagePath = 'assets/' + imagePath;
        }

        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: parseFloat(product.price),
            image: imagePath,
            quantity: 1
        });
    }

    saveCart();

    console.log('Carrito actualizado:', cart);

    updateCartDisplay();
    updateCartCount();

    showNotification('✓ Producto agregado al carrito');
}

// Actualizar cantidad
function updateQuantity(productId, newQuantity) {
    const item = cart.find(i => i.id === productId);
    if (item && newQuantity > 0) {
        item.quantity = newQuantity;
        saveCart();
        updateCartDisplay();
        updateCartCount();
    }
}

// Eliminar producto
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateCartCount();

    // Si el carrito está vacío, aseguramos que se muestre el mensaje
    if (cart.length === 0) {
        const cartSection = document.getElementById('cart-items-list');
        if (cartSection) {
            showEmptyCart();
        }
    }
    // Además, eliminamos el cupón aplicado si el subtotal ya no cumple la minCompra
    // La función actualizarTotales del sistema de cupones se encarga de esto implícitamente
}

// Mostrar carrito vacío
function showEmptyCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    if (cartItemsList) {
        const indexLink = window.resolvePath ? window.resolvePath('index.html') : 'index.html';
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <h2>El carrito está vacío :c</h2>
                <p>Agrega productos para comenzar tu compra</p>
                <a href="${indexLink}" class="continue-shopping">Continuar Comprando</a>
            </div>
        `;
    }
}

// Actualizar visualización del carrito 
function updateCartDisplay() {
    const cartItemsList = document.getElementById('cart-items-list');

    if (!cartItemsList) return;

    if (cart.length === 0) {
        showEmptyCart();
    } else {
        cartItemsList.innerHTML = cart.map((item, index) => {
            const subtotal = (item.price * item.quantity).toFixed(2);
            const imageSrc = window.resolvePath ? window.resolvePath(item.image) : item.image;

            return `
                <div class="cart-item">
                    <div class="item-number">${index + 1}</div>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')" title="Eliminar producto">🗑️</button>
                    
                    <img src="${imageSrc}" 
                         alt="${item.name}" 
                         onerror="this.src='https://via.placeholder.com/120?text=Sin+Imagen'">
                    
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="item-brand">${item.brand}</p>
                        <p class="item-sku">SKU: ${item.id}</p>
                        <div class="item-tags">
                            <span class="tag tag-express">✗ Despacho express</span>
                            <span class="tag tag-domicilio">✓ Despacho a domicilio</span>
                            <span class="tag tag-store">✓ Retiro en tienda</span>
                        </div>
                    </div>
                    <div class="item-price-section">
                        <div class="unit-price">Precio x unidad<br>S/ ${item.price.toFixed(2)}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" 
                                   onchange="updateQuantity('${item.id}', parseInt(this.value))" min="1">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                        <div class="subtotal">S/ ${subtotal}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    updateSummary();
}

// Actualizar resumen
function updateSummary() {
    // La lógica de cálculo de totales se delega completamente a la función del sistema de cupones.
    // Solo garantizamos que si los elementos no existen (e.g. no estamos en Carrito.html), no falle.

    // Llamar a la función global para actualizar totales con cupones
    if (window.actualizarTotales) {
        window.actualizarTotales();
    } else {
        // Si no existe, al menos actualizamos el total sin descuento (lógica de fallback)
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const productsTotal = document.getElementById('products-total');
        const finalTotal = document.getElementById('final-total');
        const subtotalWithDiscount = document.getElementById('subtotal-discount');

        if (productsTotal) productsTotal.textContent = `S/ ${total.toFixed(2)}`;
        if (finalTotal) finalTotal.textContent = `S/ ${total.toFixed(2)}`;
        if (subtotalWithDiscount) subtotalWithDiscount.textContent = `S/ ${(total * 0.88).toFixed(2)}`;
    }
}

// Actualizar contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cart-count');

    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// Ir al checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos para continuar.');
        return;
    }

    // VERIFICACIÓN DE USUARIO LOGUEADO
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        // Si no hay usuario, lo mandamos al login
        const confirmar = confirm('Necesitas iniciar sesión para finalizar la compra. \n¿Quieres ir a Iniciar Sesión ahora?');
        if (confirmar) {
            window.location.href = window.resolvePath ? window.resolvePath('pages/Cuenta y Pedidos.html') : 'pages/Cuenta y Pedidos.html';
        }
        return;
    }

    window.location.href = window.resolvePath ? window.resolvePath('pages/Checkout.html') : 'pages/Checkout.html';
}

function checkUserSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Usamos un selector más genérico o intentamos resolver la ruta
    const userLink = document.querySelector('.user-options a');

    if (currentUser && userLink) {
        // Cambia "Mi Cuenta y Pedidos" por "Hola, [Nombre]"
        userLink.textContent = `Hola, ${currentUser.name}`;
        userLink.style.color = "#FFD700"; 
    }
}

// Mostrar notificación (se mantiene aquí porque es una utilidad general del carrito)
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Función para inicializar los botones de agregar al carrito
function initializeAddToCartButtons() {
    // Buscar Todos los botones con clase .btn que tengan data-id
    const buttons = document.querySelectorAll('button.btn[data-id]');

    console.log('Botones encontrados:', buttons.length); // Para debugging

    buttons.forEach(button => {
        // Remover event listeners anteriores para evitar duplicados
        button.removeEventListener('click', handleAddToCart);
        // Agregar el event listener
        button.addEventListener('click', handleAddToCart);
    });
}

// Manejador del evento click para agregar al carrito
function handleAddToCart(e) {
    e.preventDefault();

    const button = e.currentTarget;

    const product = {
        id: button.getAttribute('data-id'),
        name: button.getAttribute('data-name'),
        brand: button.getAttribute('data-brand'),
        price: button.getAttribute('data-price'),
        image: button.getAttribute('data-image')
    };

    console.log('Producto a agregar:', product); // Para debugging

    // Validar que todos los datos existan
    if (product.id && product.name && product.brand && product.price && product.image) {
        addToCart(product);
    } else {
        console.error('Faltan datos del producto:', product);
        alert('Error: Faltan datos del producto');
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    console.log('Inicializando carrito...'); // Para debugging

    // Cargar carrito
    loadCart();

    // Inicializar botones de agregar al carrito
    initializeAddToCartButtons();

    checkUserSession();

    // Si la función de cupones existe, inicializar el sistema de cupones
    if (window.inicializarSistemaCupones) {
        inicializarSistemaCupones();
    }

    // Boton de checkout
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', goToCheckout);
    }

    console.log('Carrito inicializado correctamente');
}
// Guardar carrito en localStorage (Almacenamiento Local)
function saveCart() {
    localStorage.setItem('construmartCart', JSON.stringify(cart));
}
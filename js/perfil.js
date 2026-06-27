// Sistema de gestión de perfil de usuario

let currentUser = null;
let allUsers = [];

document.addEventListener('DOMContentLoaded', () => {
    // Verificar sesión
    currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = window.resolvePath ? window.resolvePath('pages/Cuenta y Pedidos.html') : 'pages/Cuenta y Pedidos.html';
        return;
    }

    // Cargar todos los usuarios
    allUsers = JSON.parse(localStorage.getItem('construmartUsers')) || [];

    // Cargar datos del perfil
    cargarDatosPerfil();

    // Inicializar eventos
    inicializarEventos();

    // Mostrar sección inicial
    mostrarSeccion('datos');
});

function cargarDatosPerfil() {
    // Actualizar título
    document.getElementById('welcome-title').textContent = `Hola, ${currentUser.name}`;

    // Datos personales
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;

    if (currentUser.dni) {
        document.getElementById('profile-dni').textContent = currentUser.dni;
        document.getElementById('profile-dni').style.fontStyle = 'normal';
        document.getElementById('profile-dni').style.color = '#333';
    }

    if (currentUser.phone) {
        document.getElementById('profile-phone').textContent = currentUser.phone;
        document.getElementById('profile-phone').style.fontStyle = 'normal';
        document.getElementById('profile-phone').style.color = '#333';
    }

    // Actualizar header
    const headerLink = document.getElementById('header-user-name');
    if (headerLink) {
        headerLink.textContent = `Hola, ${currentUser.name}`;
        headerLink.style.color = "#FFD700";
    }

    // Cargar direcciones
    cargarDirecciones();

    // Cargar tarjetas
    cargarTarjetas();

    // Cargar compras
    cargarCompras();
}

function inicializarEventos() {
    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            localStorage.removeItem('currentUser');
            window.location.href = window.resolvePath ? window.resolvePath('index.html') : 'index.html';
        }
    });

    // Formulario editar datos
    document.getElementById('form-editar-datos').addEventListener('submit', guardarDatos);

    // Formulario cambiar contraseña
    document.getElementById('form-cambiar-password').addEventListener('submit', cambiarPassword);

    // Formulario agregar dirección
    document.getElementById('form-agregar-direccion').addEventListener('submit', agregarDireccion);

    // Formulario agregar tarjeta
    document.getElementById('form-agregar-tarjeta').addEventListener('submit', agregarTarjeta);

    // Formateo de tarjeta
    const cardNumber = document.getElementById('card-number');
    cardNumber.addEventListener('input', function () {
        let value = this.value.replace(/\s/g, '');
        value = value.replace(/[^0-9]/g, '');
        value = value.match(/.{1,4}/g)?.join(' ') || value;
        this.value = value;
    });

    const cardExpiry = document.getElementById('card-expiry');
    cardExpiry.addEventListener('input', function () {
        let value = this.value.replace(/\//g, '');
        value = value.replace(/[^0-9]/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        this.value = value;
    });

    const cardCvv = document.getElementById('card-cvv');
    cardCvv.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}

function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.profile-section').forEach(s => s.style.display = 'none');

    // Remover active de todos los menús
    document.querySelectorAll('.profile-menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Mostrar sección seleccionada
    const seccionElement = document.getElementById(`seccion-${seccion}`);
    if (seccionElement) {
        seccionElement.style.display = 'block';
    }

    // Activar menú correspondiente
    if (event && event.target) {
        event.target.closest('.profile-menu-item')?.classList.add('active');
    }
}

// ========== GESTIÓN DE DATOS PERSONALES ==========

function abrirModalEditarDatos() {
    document.getElementById('edit-name').value = currentUser.name;
    document.getElementById('edit-dni').value = currentUser.dni || '';
    document.getElementById('edit-phone').value = currentUser.phone || '';
    abrirModal('modal-editar-datos');
}

function guardarDatos(e) {
    e.preventDefault();

    const name = document.getElementById('edit-name').value.trim();
    const dni = document.getElementById('edit-dni').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();

    // Validaciones
    if (name.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres');
        return;
    }

    if (dni && dni.length !== 8) {
        alert('El DNI debe tener 8 dígitos');
        return;
    }

    if (phone && phone.length !== 9) {
        alert('El teléfono debe tener 9 dígitos');
        return;
    }

    // Actualizar usuario
    currentUser.name = name;
    currentUser.dni = dni;
    currentUser.phone = phone;

    actualizarUsuario();
    cerrarModal('modal-editar-datos');
    cargarDatosPerfil();

    alert('Datos actualizados correctamente');
}

function abrirModalCambiarPassword() {
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-new-password').value = '';
    abrirModal('modal-cambiar-password');
}

function cambiarPassword(e) {
    e.preventDefault();

    const currentPass = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-new-password').value;

    // Validar contraseña actual
    if (currentPass !== currentUser.password) {
        alert('La contraseña actual es incorrecta');
        return;
    }

    // Validar nueva contraseña
    if (newPass.length < 6) {
        alert('La nueva contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (newPass !== confirmPass) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Actualizar contraseña
    currentUser.password = newPass;
    actualizarUsuario();
    cerrarModal('modal-cambiar-password');

    alert('Contraseña cambiada exitosamente');
}

// ========== GESTIÓN DE DIRECCIONES ==========

function cargarDirecciones() {
    const container = document.getElementById('lista-direcciones');

    if (!currentUser.addresses || currentUser.addresses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt" style="font-size: 3em; margin-bottom: 20px; color: #ddd;"></i>
                <p>No tienes direcciones guardadas</p>
                <p style="font-size: 0.9em;">Agrega una dirección para tus envíos</p>
            </div>
        `;
        return;
    }

    container.innerHTML = currentUser.addresses.map((dir, index) => `
        <div class="address-card">
            <div class="card-actions">
                <button onclick="eliminarDireccion(${index})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <h4 style="margin-bottom: 10px; color: #E65000;">${dir.alias}</h4>
            <p style="margin-bottom: 5px;"><strong>${dir.calle}</strong></p>
            <p style="margin-bottom: 5px;">${dir.distrito}, ${dir.ciudad}</p>
            ${dir.referencia ? `<p style="color: #666; font-size: 0.9em;">Ref: ${dir.referencia}</p>` : ''}
        </div>
    `).join('');
}

function abrirModalAgregarDireccion() {
    document.getElementById('form-agregar-direccion').reset();
    abrirModal('modal-agregar-direccion');
}

function agregarDireccion(e) {
    e.preventDefault();

    const nuevaDireccion = {
        alias: document.getElementById('dir-alias').value.trim(),
        calle: document.getElementById('dir-calle').value.trim(),
        distrito: document.getElementById('dir-distrito').value.trim(),
        ciudad: document.getElementById('dir-ciudad').value.trim(),
        referencia: document.getElementById('dir-referencia').value.trim()
    };

    if (!currentUser.addresses) {
        currentUser.addresses = [];
    }

    currentUser.addresses.push(nuevaDireccion);
    actualizarUsuario();
    cerrarModal('modal-agregar-direccion');
    cargarDirecciones();

    alert('Dirección agregada correctamente');
}

function eliminarDireccion(index) {
    if (confirm('¿Estás seguro de eliminar esta dirección?')) {
        currentUser.addresses.splice(index, 1);
        actualizarUsuario();
        cargarDirecciones();
    }
}

// ========== GESTIÓN DE TARJETAS ==========

function cargarTarjetas() {
    const container = document.getElementById('lista-tarjetas');

    if (!currentUser.paymentMethods || currentUser.paymentMethods.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-credit-card" style="font-size: 3em; margin-bottom: 20px; color: #ddd;"></i>
                <p>No tienes tarjetas guardadas</p>
                <p style="font-size: 0.9em;">Agrega una tarjeta para pagos más rápidos</p>
            </div>
        `;
        return;
    }

    container.innerHTML = currentUser.paymentMethods.map((card, index) => `
        <div class="payment-card">
            <div class="card-actions">
                <button onclick="eliminarTarjeta(${index})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-credit-card" style="font-size: 2em; color: #E65000;"></i>
                <div>
                    <h4 style="margin-bottom: 5px;">${card.name}</h4>
                    <p style="color: #666;">•••• •••• •••• ${card.lastFour}</p>
                    <p style="color: #999; font-size: 0.9em;">Vence: ${card.expiry}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function abrirModalAgregarTarjeta() {
    document.getElementById('form-agregar-tarjeta').reset();
    abrirModal('modal-agregar-tarjeta');
}

function agregarTarjeta(e) {
    e.preventDefault();

    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const cardName = document.getElementById('card-name').value.trim();
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value;

    // Validaciones
    if (cardNumber.length !== 16) {
        alert('El número de tarjeta debe tener 16 dígitos');
        return;
    }

    if (cardExpiry.length !== 5 || !cardExpiry.includes('/')) {
        alert('La fecha de expiración debe estar en formato MM/AA');
        return;
    }

    if (cardCvv.length !== 3) {
        alert('El CVV debe tener 3 dígitos');
        return;
    }

    const nuevaTarjeta = {
        name: cardName,
        lastFour: cardNumber.slice(-4),
        expiry: cardExpiry,
        addedAt: new Date().toISOString()
    };

    if (!currentUser.paymentMethods) {
        currentUser.paymentMethods = [];
    }

    currentUser.paymentMethods.push(nuevaTarjeta);
    actualizarUsuario();
    cerrarModal('modal-agregar-tarjeta');
    cargarTarjetas();

    alert('Tarjeta agregada correctamente');
}

function eliminarTarjeta(index) {
    if (confirm('¿Estás seguro de eliminar esta tarjeta?')) {
        currentUser.paymentMethods.splice(index, 1);
        actualizarUsuario();
        cargarTarjetas();
    }
}

// ========== GESTIÓN DE COMPRAS ==========

function cargarCompras() {
    const container = document.getElementById('lista-compras');

    if (!currentUser.orders || currentUser.orders.length === 0) {
        const indexLink = window.resolvePath ? window.resolvePath('index.html') : 'index.html';
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box" style="font-size: 3em; margin-bottom: 20px; color: #ddd;"></i>
                <p>No tienes compras realizadas</p>
                <p style="font-size: 0.9em;">Tus pedidos aparecerán aquí</p>
                <a href="${indexLink}" class="btn-primary" style="display: inline-block; margin-top: 20px; text-decoration: none;">
                    Comenzar a comprar
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = currentUser.orders.map((order) => {
        const statusClass = order.status === 'completed' ? 'status-completed' :
            order.status === 'processing' ? 'status-processing' : 'status-shipped';
        const statusText = order.status === 'completed' ? 'Entregado' :
            order.status === 'processing' ? 'En proceso' : 'En camino';

        const orderDate = new Date(order.date).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const deliveryDate = order.estimatedDelivery ?
            new Date(order.estimatedDelivery).toLocaleDateString('es-PE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'No especificada';

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h4>Pedido #${order.id}</h4>
                        <p style="color: #666; font-size: 0.9em;">${orderDate}</p>
                    </div>
                    <span class="order-status ${statusClass}">${statusText}</span>
                </div>
                
                <!-- Productos del pedido -->
                <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                    <h5 style="margin-bottom: 10px; color: #E65000;">📦 Productos (${order.items.length})</h5>
                    ${order.items.map(item => `
                        <div style="display: flex; gap: 15px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                            <img src="${window.resolvePath ? window.resolvePath(item.image) : item.image}" alt="${item.name}" 
                                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;"
                                 onerror="this.src='https://via.placeholder.com/60?text=Sin+Imagen'">
                            <div style="flex: 1;">
                                <p style="margin-bottom: 5px; font-weight: 500;">${item.name}</p>
                                <p style="color: #666; font-size: 0.9em;">${item.brand}</p>
                                <p style="color: #666; font-size: 0.9em;">Cantidad: ${item.quantity} x S/ ${item.price.toFixed(2)}</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="font-weight: bold; color: #E65000;">S/ ${item.subtotal.toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Detalles de pago -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div>
                        <h5 style="margin-bottom: 10px; color: #555;">💰 Resumen de pago</h5>
                        <div style="font-size: 0.9em;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span>Subtotal:</span>
                                <span>S/ ${order.subtotal.toFixed(2)}</span>
                            </div>
                            ${order.discount > 0 ? `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #4CAF50;">
                                    <span>Descuento (${order.couponCode}):</span>
                                    <span>-S/ ${order.discount.toFixed(2)}</span>
                                </div>
                            ` : ''}
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span>Envío:</span>
                                <span>${order.shippingCost === 0 ? 'Gratis' : 'S/ ' + order.shippingCost.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; font-weight: bold; font-size: 1.1em;">
                                <span>TOTAL:</span>
                                <span style="color: #E65000;">S/ ${order.total.toFixed(2)}</span>
                            </div>
                            <p style="color: #666; font-size: 0.85em; margin-top: 5px;">
                                💳 ${order.paymentMethod}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h5 style="margin-bottom: 10px; color: #555;">📍 Entrega</h5>
                        <div style="font-size: 0.9em; color: #666;">
                            ${order.deliveryInfo ? `
                                <p style="margin-bottom: 5px;"><strong>${order.deliveryInfo.address}</strong></p>
                                <p style="margin-bottom: 5px;">${order.deliveryInfo.district}, ${order.deliveryInfo.province}</p>
                                <p style="margin-bottom: 5px;">${order.deliveryInfo.region}</p>
                                ${order.deliveryInfo.reference ? `<p style="font-size: 0.85em; color: #999;">Ref: ${order.deliveryInfo.reference}</p>` : ''}
                            ` : '<p>Dirección no especificada</p>'}
                            <p style="margin-top: 10px; color: #2196F3;">
                                <i class="fas fa-truck"></i> Entrega estimada: <strong>${deliveryDate}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Botones de acción -->
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="btn-primary" onclick="verDetalleCompleto('${order.id}')" style="flex: 1;">
                        Ver detalles completos
                    </button>
                    <button class="btn-secondary" onclick="volverAComprar('${order.id}')" style="flex: 1;">
                        Volver a comprar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function verDetalleCompleto(orderId) {
    const order = currentUser.orders.find(o => o.id === orderId);
    if (!order) return;

    let detalleHTML = `DETALLE COMPLETO DEL PEDIDO\n`;
    detalleHTML += `================================\n`;
    detalleHTML += `Pedido: ${order.id}\n`;
    detalleHTML += `Fecha: ${new Date(order.date).toLocaleString('es-PE')}\n`;
    detalleHTML += `Estado: ${order.status === 'completed' ? 'Entregado' : order.status === 'processing' ? 'En proceso' : 'En camino'}\n\n`;

    detalleHTML += `PRODUCTOS:\n`;
    order.items.forEach((item, i) => {
        detalleHTML += `${i + 1}. ${item.name}\n`;
        detalleHTML += `   Marca: ${item.brand}\n`;
        detalleHTML += `   Cantidad: ${item.quantity} x S/ ${item.price.toFixed(2)}\n`;
        detalleHTML += `   Subtotal: S/ ${item.subtotal.toFixed(2)}\n\n`;
    });

    detalleHTML += `TOTALES:\n`;
    detalleHTML += `Subtotal: S/ ${order.subtotal.toFixed(2)}\n`;
    if (order.discount > 0) {
        detalleHTML += `Descuento: -S/ ${order.discount.toFixed(2)}\n`;
    }
    detalleHTML += `Envío: S/ ${order.shippingCost.toFixed(2)}\n`;
    detalleHTML += `TOTAL: S/ ${order.total.toFixed(2)}\n\n`;

    detalleHTML += `Método de pago: ${order.paymentMethod}\n`;

    alert(detalleHTML);
}

function volverAComprar(orderId) {
    const order = currentUser.orders.find(o => o.id === orderId);
    if (!order) return;

    if (confirm(`¿Deseas agregar los ${order.items.length} productos de este pedido al carrito?`)) {
        // Obtener carrito actual
        let cart = JSON.parse(localStorage.getItem('construmartCart')) || [];

        // Agregar productos del pedido al carrito
        order.items.forEach(item => {
            const existingItem = cart.find(c => c.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                // Limpiar imagen si es necesario (aunque ya debería estar limpia en el pedido)
                let imagePath = item.image;
                if (imagePath.startsWith('../')) {
                    imagePath = imagePath.substring(3);
                }

                cart.push({
                    id: item.id,
                    name: item.name,
                    brand: item.brand,
                    price: item.price,
                    image: imagePath,
                    quantity: item.quantity
                });
            }
        });

        // Guardar carrito actualizado
        localStorage.setItem('construmartCart', JSON.stringify(cart));

        alert('Productos agregados al carrito exitosamente');
        window.location.href = window.resolvePath ? window.resolvePath('pages/Carrito.html') : 'pages/Carrito.html';
    }
}

// ========== FUNCIONES AUXILIARES ==========

function actualizarUsuario() {
    // Actualizar en localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Actualizar en la lista de usuarios
    const userIndex = allUsers.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        allUsers[userIndex] = currentUser;
        localStorage.setItem('construmartUsers', JSON.stringify(allUsers));
    }
}

function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Exportar funciones para uso global
window.mostrarSeccion = mostrarSeccion;
window.abrirModalEditarDatos = abrirModalEditarDatos;
window.abrirModalCambiarPassword = abrirModalCambiarPassword;
window.abrirModalAgregarDireccion = abrirModalAgregarDireccion;
window.abrirModalAgregarTarjeta = abrirModalAgregarTarjeta;
window.eliminarDireccion = eliminarDireccion;
window.eliminarTarjeta = eliminarTarjeta;
window.cerrarModal = cerrarModal;
window.verDetalleCompleto = verDetalleCompleto;
window.volverAComprar = volverAComprar;
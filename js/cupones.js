// Sistema de cupones de descuento

// Base de datos de cupones válidos
const cuponesValidos = {
    'CONSTRUMART10': {
        descuento: 10,
        tipo: 'porcentaje',
        descripcion: '10% de descuento',
        minCompra: 100,
        maxDescuento: 50,
        expira: '2025-12-31',
        usosPorUsuario: 3
    },
    'DESCUENTO15': {
        descuento: 15,
        tipo: 'porcentaje',
        descripcion: '15% de descuento',
        minCompra: 200,
        maxDescuento: 100,
        expira: '2025-12-31',
        usosPorUsuario: 2
    },
    'PROMO25': {
        descuento: 25,
        tipo: 'monto',
        descripcion: 'S/ 25 de descuento',
        minCompra: 150,
        maxDescuento: 25,
        expira: '2025-12-31',
        usosPorUsuario: 1
    },
    'NUEVOCLIENTE': {
        descuento: 20,
        tipo: 'porcentaje',
        descripcion: '20% para nuevos clientes',
        minCompra: 50,
        maxDescuento: 80,
        expira: '2025-12-31',
        usosPorUsuario: 1,
        soloNuevos: true
    },
    'ENVIOGRATIS': {
        descuento: 23,
        tipo: 'envio',
        descripcion: 'Envío gratis',
        minCompra: 100,
        maxDescuento: 23,
        expira: '2025-12-31',
        usosPorUsuario: 5
    },
    'BLACKFRIDAY': {
        descuento: 30,
        tipo: 'porcentaje',
        descripcion: '30% Black Friday',
        minCompra: 300,
        maxDescuento: 200,
        expira: '2025-11-30',
        usosPorUsuario: 1
    }
};

// Estado del cupón actual
let cuponActual = null;

// Inicializar sistema de cupones en la página del carrito
function inicializarSistemaCupones() {
    const applyButton = document.querySelector('.apply-btn');
    
    if (applyButton) {
        applyButton.addEventListener('click', aplicarCupon);
    }
    
    // Permitir aplicar con Enter
    const couponInput = document.getElementById('coupon-input');
    if (couponInput) {
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                aplicarCupon();
            }
        });
    }
    
    // Cargar cupón guardado si existe
    const cuponGuardado = sessionStorage.getItem('cuponAplicado');
    if (cuponGuardado) {
        cuponActual = JSON.parse(cuponGuardado);
        mostrarCuponAplicado();
    }
}

function aplicarCupon() {
    const couponInput = document.getElementById('coupon-input');
    if (!couponInput) return;
    
    const codigoCupon = couponInput.value.trim().toUpperCase();
    
    if (codigoCupon === '') {
        mostrarMensaje('Por favor ingresa un código de cupón', 'error');
        return;
    }
    
    // Verificar si el cupón existe
    const cupon = cuponesValidos[codigoCupon];
    
    if (!cupon) {
        mostrarMensaje('Cupón no válido', 'error');
        couponInput.value = '';
        return;
    }
    
    // Verificar si el cupón ha expirado
    if (new Date(cupon.expira) < new Date()) {
        mostrarMensaje('Este cupón ha expirado', 'error');
        couponInput.value = '';
        return;
    }
    
    // Obtener total del carrito
    const cart = JSON.parse(localStorage.getItem('construmartCart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Verificar compra mínima
    if (subtotal < cupon.minCompra) {
        mostrarMensaje(`Este cupón requiere una compra mínima de S/ ${cupon.minCompra}`, 'error');
        return;
    }
    
    // Verificar si es para nuevos clientes
    if (cupon.soloNuevos) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.orders && currentUser.orders.length > 0) {
            mostrarMensaje('Este cupón es solo para nuevos clientes', 'error');
            return;
        }
    }
    
    // Verificar límite de usos por usuario
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const usosDelCupon = obtenerUsosCupon(currentUser.email, codigoCupon);
        if (usosDelCupon >= cupon.usosPorUsuario) {
            mostrarMensaje('Has alcanzado el límite de usos para este cupón', 'error');
            return;
        }
    }
    
    // Aplicar cupón
    cuponActual = {
        codigo: codigoCupon,
        ...cupon
    };
    
    sessionStorage.setItem('cuponAplicado', JSON.stringify(cuponActual));
    
    mostrarMensaje(`¡Cupón aplicado! ${cupon.descripcion}`, 'success');
    couponInput.value = '';
    mostrarCuponAplicado();
    actualizarTotales();
}

function mostrarCuponAplicado() {
    if (!cuponActual) return;
    
    const couponSection = document.querySelector('.coupon-section');
    if (!couponSection) return;
    
    // Crear badge de cupón aplicado
    let badge = document.getElementById('cupon-aplicado-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'cupon-aplicado-badge';
        badge.style.cssText = `
            background: #e8f5e9;
            border: 1px solid #4caf50;
            border-radius: 6px;
            padding: 12px;
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        couponSection.appendChild(badge);
    }
    
    badge.innerHTML = `
        <div>
            <strong style="color: #2e7d32;">✓ ${cuponActual.codigo}</strong><br>
            <small style="color: #666;">${cuponActual.descripcion}</small>
        </div>
        <button onclick="eliminarCupon()" style="background: none; border: none; color: #d32f2f; cursor: pointer; font-size: 1.2em;">
            ×
        </button>
    `;
}

function eliminarCupon() {
    cuponActual = null;
    sessionStorage.removeItem('cuponAplicado');
    
    const badge = document.getElementById('cupon-aplicado-badge');
    if (badge) {
        badge.remove();
    }
    
    actualizarTotales();
    mostrarMensaje('Cupón eliminado', 'info');
}

function calcularDescuento(subtotal) {
    if (!cuponActual) return 0;
    
    let descuento = 0;
    
    if (cuponActual.tipo === 'porcentaje') {
        descuento = subtotal * (cuponActual.descuento / 100);
    } else if (cuponActual.tipo === 'monto') {
        descuento = cuponActual.descuento;
    } else if (cuponActual.tipo === 'envio') {
        // Descuento en envío (se maneja por separado)
        return 0;
    }
    
    // Aplicar descuento máximo
    return Math.min(descuento, cuponActual.maxDescuento);
}

function actualizarTotales() {
    const cart = JSON.parse(localStorage.getItem('construmartCart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const productsTotal = document.getElementById('products-total');
    const finalTotal = document.getElementById('final-total');
    const subtotalWithDiscount = document.getElementById('subtotal-discount');
    
    if (!productsTotal || !finalTotal) return;
    
    // Calcular descuento
    const descuento = calcularDescuento(subtotal);
    const descuentoEnvio = cuponActual?.tipo === 'envio' ? 23 : 0;
    
    // Actualizar subtotal de productos
    productsTotal.textContent = `S/ ${subtotal.toFixed(2)}`;
    
    // Si hay descuento, mostrar fila de descuento
    let discountRow = document.getElementById('discount-row');
    if (descuento > 0) {
        if (!discountRow) {
            discountRow = document.createElement('div');
            discountRow.id = 'discount-row';
            discountRow.className = 'summary-row';
            discountRow.style.color = '#4CAF50';
            
            const summaryElement = document.querySelector('.cart-summary');
            const totalRow = document.querySelector('.summary-total');
            summaryElement.insertBefore(discountRow, totalRow);
        }
        
        discountRow.innerHTML = `
            <span>Descuento <span class="discount-badge">${cuponActual.codigo}</span></span>
            <span style="color: #4CAF50; font-weight: bold;">-S/ ${descuento.toFixed(2)}</span>
        `;
        discountRow.style.display = 'flex';
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
    
    // Mostrar descuento en envío si aplica
    let shippingRow = document.getElementById('shipping-discount-row');
    if (descuentoEnvio > 0) {
        if (!shippingRow) {
            shippingRow = document.createElement('div');
            shippingRow.id = 'shipping-discount-row';
            shippingRow.className = 'summary-row';
            shippingRow.style.color = '#4CAF50';
            
            const summaryElement = document.querySelector('.cart-summary');
            const totalRow = document.querySelector('.summary-total');
            summaryElement.insertBefore(shippingRow, totalRow);
        }
        
        shippingRow.innerHTML = `
            <span>Envío gratis <span class="discount-badge">${cuponActual.codigo}</span></span>
            <span style="color: #4CAF50; font-weight: bold;">-S/ ${descuentoEnvio.toFixed(2)}</span>
        `;
        shippingRow.style.display = 'flex';
    } else if (shippingRow) {
        shippingRow.style.display = 'none';
    }
    
    // Calcular total final
    const totalFinal = subtotal - descuento - descuentoEnvio;
    finalTotal.textContent = `S/ ${totalFinal.toFixed(2)}`;
    
    // Actualizar subtotal con descuento de tarjeta (12% adicional)
    if (subtotalWithDiscount) {
        const conTarjeta = totalFinal * 0.88;
        subtotalWithDiscount.textContent = `S/ ${conTarjeta.toFixed(2)}`;
    }
}

function obtenerUsosCupon(email, codigoCupon) {
    // Obtener historial de cupones usados
    const historialCupones = JSON.parse(localStorage.getItem('historialCupones')) || {};
    const userCupones = historialCupones[email] || {};
    return userCupones[codigoCupon] || 0;
}

function registrarUsoCupon(email, codigoCupon) {
    const historialCupones = JSON.parse(localStorage.getItem('historialCupones')) || {};
    
    if (!historialCupones[email]) {
        historialCupones[email] = {};
    }
    
    if (!historialCupones[email][codigoCupon]) {
        historialCupones[email][codigoCupon] = 0;
    }
    
    historialCupones[email][codigoCupon]++;
    localStorage.setItem('historialCupones', JSON.stringify(historialCupones));
}

function mostrarMensaje(mensaje, tipo) {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = mensaje;
    
    if (tipo === 'error') {
        notification.style.backgroundColor = '#d32f2f';
    } else if (tipo === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else if (tipo === 'info') {
        notification.style.backgroundColor = '#2196F3';
    }
    
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

// Aplicar cupón en el checkout
function aplicarCuponEnCheckout() {
    if (!cuponActual) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        registrarUsoCupon(currentUser.email, cuponActual.codigo);
    }
}

// Limpiar cupón al finalizar compra
function limpiarCupon() {
    cuponActual = null;
    sessionStorage.removeItem('cuponAplicado');
}

// Exportar funciones para uso global
window.inicializarSistemaCupones = inicializarSistemaCupones;
window.eliminarCupon = eliminarCupon;
window.aplicarCuponEnCheckout = aplicarCuponEnCheckout;
window.limpiarCupon = limpiarCupon;
window.actualizarTotales = actualizarTotales;

// Inicializar automáticamente si estamos en la página del carrito
if (document.getElementById('coupon-input')) {
    document.addEventListener('DOMContentLoaded', inicializarSistemaCupones);
}
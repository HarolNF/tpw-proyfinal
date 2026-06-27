document.addEventListener('DOMContentLoaded', function () {
    const modalHTML = `
        <div id="imageZoomModal" class="image-zoom-modal">
            <div class="zoom-modal-content">
                <button class="zoom-close-btn" onclick="closeZoomModal()">&times;</button>
                <img id="zoomImage" class="zoom-modal-image" src="" alt="Zoomed Product">
                <div class="zoom-product-info" id="zoomProductInfo">
                    <div class="zoom-product-details">
                        <h4 id="zoomProductName">Product Name</h4>
                        <p class="brand" id="zoomProductBrand">Brand</p>
                        <p class="price" id="zoomProductPrice">S/ 0.00</p>
                    </div>
                    <button id="zoomAddToCartBtn" class="zoom-add-to-cart">Agregar al Carrito</button>
                </div>
            </div>
        </div>
    `;

    
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('imageZoomModal');
    const zoomImage = document.getElementById('zoomImage');
    const zoomProductName = document.getElementById('zoomProductName');
    const zoomProductBrand = document.getElementById('zoomProductBrand');
    const zoomProductPrice = document.getElementById('zoomProductPrice');
    const zoomAddToCartBtn = document.getElementById('zoomAddToCartBtn');

    // Funcion para abrir la ventana
    window.openZoomModal = function (imageSrc, name, brand, price, productId) {
        zoomImage.src = imageSrc;
        zoomProductName.textContent = name;
        zoomProductBrand.textContent = brand || '';
        zoomProductPrice.textContent = price.startsWith('S/') ? price : `S/ ${price}`;

        // Configurar el botón «Añadir al carrito»
        zoomAddToCartBtn.onclick = function () {
            // Comprueba si existe la función addToCart (de carrito.js)
            if (typeof addToCart === 'function') {
                //  Crea un elemento de botón temporal para simular directamente la lógica de click
                // Construiremos el objeto de datos esperado por addToCart
                // Nota: addToCart suele esperar un evento o elemento con conjunto de datos
                const originalBtn = document.querySelector(`button[data-id="${productId}"]`);
                if (originalBtn) {
                    originalBtn.click();
                    closeZoomModal();
                } else {
                    console.warn('Original add to cart button not found');
                }
            } else {
                console.error('addToCart function not found');
            }
        };

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };


    window.closeZoomModal = function () {
        modal.classList.remove('active');
        document.body.style.overflow = ''; 
    };


    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeZoomModal();
        }
    });


    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeZoomModal();
        }
    });

    
    function attachImageListeners() {
        // Seleccionar todas las imágenes de productos en tarjetas
        const productImages = document.querySelectorAll('.card img, .product-card-image img');

        productImages.forEach(img => {
            img.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const card = img.closest('.card') || img.closest('.product-card');
                if (card) {

                    const btn = card.querySelector('button[data-id]'); 

                    if (btn) {
                        const name = btn.dataset.name;
                        // marca
                        const brand = btn.dataset.brand;
                        // precio
                        const price = btn.dataset.price;
                        const id = btn.dataset.id;
                        const imageSrc = img.src;

                        openZoomModal(imageSrc, name, brand, price, id);
                    }
                }
            });
        });
    }
    attachImageListeners();
});

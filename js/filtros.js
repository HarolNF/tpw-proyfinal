// Sistema de filtros para páginas de categorías

document.addEventListener('DOMContentLoaded', function() {
    inicializarFiltros();
});

function inicializarFiltros() {
    const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    
    // Agregar evento a cada checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });
    
    console.log('Sistema de filtros inicializado con', checkboxes.length, 'filtros');
}

function aplicarFiltros() {
    // Obtener todos los filtros activos
    const filtrosActivos = {
        marcas: [],
        precios: [],
        promociones: [],
        tipos: [],
        categorias: [], 
        descuentos: []
    };
    
    // Funcion auxiliar para buscar y recolectar filtros
    const recolectarFiltros = (groupName, targetArray) => {
        const group = Array.from(document.querySelectorAll('.filter-group')).find(g => {
            const summary = g.querySelector('summary');
            return summary && summary.textContent.trim() === groupName;
        });
        
        if (group) {
            group.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                targetArray.push(cb.parentElement.textContent.trim());
            });
        }
    };
    
    // Recopilar filtros (compatible con index y ofertas)
    recolectarFiltros('Marca', filtrosActivos.marcas);
    recolectarFiltros('Precio', filtrosActivos.precios);
    recolectarFiltros('Promociones', filtrosActivos.promociones);
    recolectarFiltros('Tipo de Producto', filtrosActivos.tipos);
    
    // Recopilar los nuevos filtros de la página de Ofertas
    recolectarFiltros('Categoría', filtrosActivos.categorias);
    recolectarFiltros('Descuento', filtrosActivos.descuentos);
    
    console.log('Filtros activos:', filtrosActivos);
    
    // Aplicar filtros a los productos
    aplicarFiltrosAProductos(filtrosActivos);
}

function aplicarFiltrosAProductos(filtros) {
    const productCards = document.querySelectorAll('.product-card');
    let productosVisibles = 0;
    
    productCards.forEach(card => {
        let visible = true;
        
        // FILTRO DE MARCA 
        if (filtros.marcas.length > 0) {
            const brandElement = card.querySelector('.brand');
            if (brandElement) {
                const brand = brandElement.textContent.trim();
                visible = filtros.marcas.some(marca => brand === marca || brand.includes(marca));
            } else {
                visible = false;
            }
        }
        
        if (visible && filtros.categorias.length > 0) {
            // Se asume que el producto tiene un atributo 'data-category' para filtrar
            const productCategory = card.getAttribute('data-category')?.toLowerCase() || '';
            
            visible = filtros.categorias.some(cat => {
                const catLower = cat.toLowerCase();
                // Normalización de texto para comparación (ej: "Baño y Gasfitería" vs "baño y gasfiteria")
                const catNormalizada = catLower.replace(/í/g, 'i').replace(/ñ/g, 'n');
                
                return productCategory.includes(catNormalizada) || productCategory.includes(catLower);
            });
            
            // Si se aplica el filtro de categoría y el producto no tiene el atributo, se oculta
            if (visible && productCategory === '') {
                 visible = false; 
            }
        }
        
        if (visible && filtros.descuentos.length > 0) {
            const badgeElement = card.querySelector('.badge');
            let descuentoPorcentaje = 0;
            let isLiquidacion = false;
            
            if (badgeElement) {
                const badgeText = badgeElement.textContent.toUpperCase();
                if (badgeText.includes('LIQUIDACIÓN') || badgeText.includes('LIQUIDACION')) {
                    isLiquidacion = true;
                } else {
                    const match = badgeText.match(/(\d+)%/);
                    if(match) {
                        descuentoPorcentaje = parseInt(match[1]);
                    }
                }
            }
            
            visible = filtros.descuentos.some(rango => {
                const rangoTexto = rango.toUpperCase();
                
                if (rangoTexto.includes('50% O MÁS')) {
                    return descuentoPorcentaje >= 50;
                } else if (rangoTexto.includes('30% A 40%')) {
                    return descuentoPorcentaje >= 30 && descuentoPorcentaje <= 40;
                } else if (rangoTexto.includes('10% A 20%')) {
                    return descuentoPorcentaje >= 10 && descuentoPorcentaje <= 20;
                } else if (rangoTexto.includes('LIQUIDACIÓN') || rangoTexto.includes('LIQUIDACION')) {
                    return isLiquidacion;
                }
                return false;
            });
            
            // Si hay filtros de descuento activos, pero el producto no tiene un badge relevante, se oculta
            if (!badgeElement && !isLiquidacion) {
                 visible = false;
            }
        }
        
        // FILTRO DE PRECIO 
        if (visible && filtros.precios.length > 0) {
            const priceElement = card.querySelector('.price');
            if (priceElement) {
                // Extraer el precio numérico 
                const priceText = priceElement.textContent;
                const priceMatch = priceText.match(/S\/\s*(\d+(?:[,\.]\d+)*)/);
                
                if (priceMatch) {
                    
                    const precio = parseFloat(priceMatch[1].replace(/,/g, ''));
                    
                    visible = filtros.precios.some(rango => {
                        const rangoUpper = rango.toUpperCase();
                        
                        // RANGOS DE OFERTAS (PROBABLES)
                        if (rangoUpper.includes('HASTA S/ 50.00')) {
                            return precio <= 50.00;
                        } else if (rangoUpper.includes('S/ 50.00 - S/ 150.00')) {
                            return precio > 50.00 && precio <= 150.00;
                        } else if (rangoUpper.includes('MÁS DE S/ 150.00')) {
                            return precio > 150.00;
                        }
                        
                        // RANGOS DEL INDEX/CATEGORÍA ORIGINAL
                        else if (rangoUpper.includes('S/0 - S/100')) {
                            return precio >= 0 && precio <= 100;
                        } else if (rangoUpper.includes('S/101 - S/500')) {
                            return precio >= 101 && precio <= 500;
                        } else if (rangoUpper.includes('S/501')) {
                            return precio >= 501;
                        }
                        return false;
                    });
                } else {
                    visible = false;
                }
            }
        }
        
        // FILTRO DE PROMOCIONES (Original para 'Envio GRATIS', etc.)
        if (visible && filtros.promociones.length > 0) {
            const hasEnvioGratis = card.querySelector('.shipping-tag')?.textContent.toLowerCase().includes('gratis');
            const hasDescuento = card.querySelector('.badge')?.textContent.includes('%') || 
                                 card.querySelector('.old-price') !== null;
            
            visible = filtros.promociones.some(promo => {
                if (promo.includes('Envío GRATIS') || promo.includes('EnvÃ­o GRATIS')) {
                    return hasEnvioGratis;
                }
                if (promo.includes('Promociones')) {
                    return hasDescuento;
                }
                return false;
            });
        }
        
        // FILTRO DE TIPO DE PRODUCTO 
        if (visible && filtros.tipos.length > 0) {
            const productName = card.querySelector('h4, h3')?.textContent.toLowerCase() || '';
            const productType = card.getAttribute('data-type')?.toLowerCase() || '';
            
            visible = filtros.tipos.some(tipo => {
                const tipoLower = tipo.toLowerCase();
                
                const tipoNormalizado = tipoLower
                    .replace(/s$/, '') 
                    .replace(/és/g, 'e') 
                    .replace(/ía/g, 'i')
                    .trim();
                
                return productName.includes(tipoNormalizado) || 
                       productType.includes(tipoNormalizado) ||
                       productName.includes(tipoLower) ||
                       productType.includes(tipoLower);
            });
        }
        
        // Mostrar/ocultar producto
        if (visible) {
            card.style.display = 'block';
            productosVisibles++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mostrar mensaje si no hay productos
    mostrarMensajeNoResultados(productosVisibles);
    
    console.log('Productos visibles:', productosVisibles);
}

function mostrarMensajeNoResultados(cantidad) {
    let mensaje = document.getElementById('no-results-message');
    const productsContent = document.querySelector('.products-content');
    
    if (cantidad === 0) {
        // Crear mensaje si no existe
        if (!mensaje) {
            mensaje = document.createElement('div');
            mensaje.id = 'no-results-message';
            mensaje.style.cssText = `
                text-align: center;
                padding: 60px 20px;
                background: #f9f9f9;
                border-radius: 8px;
                margin-top: 20px;
            `;
            mensaje.innerHTML = `
                <i class="fas fa-search" style="font-size: 3em; color: #ddd; margin-bottom: 20px;"></i>
                <h3 style="color: #666; margin-bottom: 10px;">No se encontraron productos</h3>
                <p style="color: #999;">Intenta ajustar los filtros para ver más resultados</p>
                <button onclick="limpiarFiltros()" style="
                    margin-top: 20px;
                    padding: 12px 25px;
                    background: #E65000;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">Limpiar filtros</button>
            `;
            
            if (productsContent) {
                productsContent.appendChild(mensaje);
            }
        }
        mensaje.style.display = 'block';
    } else {
        // Ocultar mensaje si existe
        if (mensaje) {
            mensaje.style.display = 'none';
        }
    }
}

function limpiarFiltros() {
    // Desmarcar todos los checkboxes
    const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Mostrar todos los productos
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = 'block';
    });
    
    // Ocultar mensaje de no resultados
    const mensaje = document.getElementById('no-results-message');
    if (mensaje) {
        mensaje.style.display = 'none';
    }
    
    console.log('Filtros limpiados');
}

// Exportar para uso global
window.limpiarFiltros = limpiarFiltros;
window.aplicarFiltros = aplicarFiltros;
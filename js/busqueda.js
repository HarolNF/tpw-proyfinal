// Base de datos de todos los productos
const todosLosProductos = [
    // Herramientas
    { id: 'herr-001', name: 'COMBO Bosch Inalámbrico: Taladro + Amoladora Gws 18v', brand: 'Bosch', price: 1299, category: 'herramientas', image: '../assets/img/ComboTaladro.png' },
    { id: 'herr-002', name: 'COMBO Dewalt Inalámbrico: Taladro Percutor + Esmeril', brand: 'DeWalt', price: 1099, category: 'herramientas', image: '../assets/img/ComoDeWalt.png' },
    { id: 'herr-003', name: 'Sierra Circular SC16 1600W + 2 Discos 7-1/4"', brand: 'Stanley', price: 259, category: 'herramientas', image: '../assets/img/Combo1Disco.png' },
    { id: 'herr-004', name: 'Taladro Percutor 1/2" 20V + Atornillador de Impacto', brand: 'DeWalt', price: 949, category: 'herramientas', image: '../assets/img/TaladroPerc.jpg' },
    { id: 'herr-005', name: 'Juego de Herramientas Mecánicas 122 Piezas', brand: 'Stanley', price: 379, category: 'herramientas', image: '../assets/img/JuegoHerramientas.jpg' },
    { id: 'herr-006', name: 'Taladro Atornillador Inalámbrico 12V + 2 Baterías', brand: 'Makita', price: 399, category: 'herramientas', image: '../assets/img/TaladroAtornillador.png' },

    // Electricidad
    { id: 'elec-001', name: 'COMBO Tomacorrientes Orange', brand: 'Orange', price: 49, category: 'electricidad', image: '../assets/img/Tomacorrientes1.png' },
    { id: 'elec-002', name: 'Enchufes', brand: 'Werken', price: 9, category: 'electricidad', image: '../assets/img/Enchufe1.png' },
    { id: 'elec-003', name: 'Tomacorriente + 2 USB', brand: 'Orange', price: 9, category: 'electricidad', image: '../assets/img/Tomacorrientes2.png' },
    { id: 'elec-004', name: 'Termomagnético Mcb 2x40A', brand: 'Schneider Electric', price: 40, category: 'electricidad', image: '../assets/img/termomagnetico1.jpg' },
    { id: 'elec-005', name: 'Lámpara de emergencia 2 luces', brand: 'Werken', price: 29.90, category: 'electricidad', image: '../assets/img/LampDeEmergencia1.jpg' },
    { id: 'elec-006', name: 'Cable THW-90 450/750 V 14 100m', brand: 'Celsa', price: 125, category: 'electricidad', image: '../assets/img/cable2.png' },

    // Gasfitería
    { id: 'gas-001', name: 'Tubo PVC Salubridad 4in x 3m', brand: 'Pavco', price: 28.90, category: 'gasfiteria', image: '../assets/img/tubo-pvc-desaguee-4-x-3-m-pavco.jpg' },
    { id: 'gas-002', name: 'Mezcladora Lavadero Monocomando', brand: 'Vainsa', price: 89.90, category: 'gasfiteria', image: '../assets/img/MezcladoraLavaderoMonocomando.jpg' },
    { id: 'gas-003', name: 'Pegamento PVC Azul 8oz', brand: 'Oatey', price: 18.50, category: 'gasfiteria', image: '../assets/img/PegamentoPVC.jpg' },
    { id: 'gas-004', name: 'Válvula Esférica 1/2"', brand: 'Cim', price: 15.00, category: 'gasfiteria', image: '../assets/img/ValvulaEsferica.webp' },
    { id: 'gas-005', name: 'Codo PVC 4in x 90', brand: 'Pavco', price: 5.50, category: 'gasfiteria', image: '../assets/img/codosanitariopavco.jpg' },
    { id: 'gas-006', name: 'Tubo Abasto Acero 1/2"', brand: 'Coflex', price: 12.90, category: 'gasfiteria', image: '../assets/img/TuboAbasto.jpg' },

    // Materiales de Construcción
    { id: 'mc-001', name: 'Cemento Sol Portland 42.5 kg', brand: 'Sol', price: 30.99, category: 'materiales', image: '../assets/img/CementoSolPortland.png' },
    { id: 'mc-002', name: 'Bloque de vidrio Neutro liso transparente 19x19x10 cm', brand: 'Chema', price: 10.80, category: 'materiales', image: '../assets/img/BloqueVidrioNeutro.jpg' },
    { id: 'mc-003', name: 'Plancha de Drywall Gyplac Exterior Resistente 12mm 1.22x2.44m', brand: 'Gyplac', price: 59.00, category: 'materiales', image: '../assets/img/PlanchasDrywall.png' },
    { id: 'mc-004', name: 'Fierro 5/8"x 9m Aceros Arequipa', brand: 'Aceros Arequipa', price: 47.50, category: 'materiales', image: '../assets/img/FierroAcerosArequipa.jpg' },
    { id: 'mc-005', name: 'Masilla para Drywall Gyplac lista para usar 27 kg', brand: 'Gyplac', price: 70.00, category: 'materiales', image: '../assets/img/MasillaDrywall.jpg' },
    { id: 'mc-006', name: 'Cinta malla fibra de vidrio 2" rollo 45m Werken', brand: 'Werken', price: 48.51, category: 'materiales', image: '../assets/img/CintaDrywall.jpg' },
    { id: 'mc-007', name: 'Cinta malla fibra de vidrio 2" rollo 75m Werken', brand: 'Werken', price: 65.92, category: 'materiales', image: '../assets/img/CintaDrywall.jpg' },
    { id: 'mc-008', name: 'Acelerador de concreto Sika Cem 4L', brand: 'Silka', price: 40.63, category: 'materiales', image: '../assets/img/AceleradorConcreto.jpg' },

    // Pisos
    { id: 'piso-001', name: 'Piso Gress Liso Edimburgo 60x60cm', brand: 'Orange', price: 25.19, category: 'pisos', image: '../assets/img/Piso1.jpg' },
    { id: 'piso-002', name: 'Piso SPC Avellana 1185x182x4.5mm', brand: 'Celima', price: 28.76, category: 'pisos', image: '../assets/img/piso2.jpg' },
    { id: 'piso-003', name: 'Piso Cerámico Marmolizado Sandy White 45x45cm 2.23m2 Celima', brand: 'Celima', price: 28.76, category: 'pisos', image: '../assets/img/Piso3.png' },
    { id: 'piso-004', name: 'Piso Cerámico Marmolizado Sandy White 45x45cm', brand: 'Gala', price: 39.84, category: 'pisos', image: '../assets/img/Piso4.png' },
    { id: 'piso-005', name: 'Porcelanato Tipo Madera 60x60 cm', brand: 'Celima', price: 39.90, category: 'pisos', image: '../assets/img/PorcelanatoMadera.jpg' },
    { id: 'piso-006', name: 'Piso Gress Liso Firenze 60x60cm', brand: 'Celima', price: 35.90, category: 'pisos', image: '../assets/img/piso5.jpg' },

    // Acabados
    { id: 'acab-001', name: 'Natural Mate Supra 21x123- Cerámica Embramaco', brand: 'Orange', price: 25.19, category: 'acabados', image: '../assets/img/ListonesCeramicos.jpg' },
    { id: 'acab-002', name: 'Azulejos Ceramicos Subway Negro Biselado 10x20', brand: 'Celima', price: 28.76, category: 'acabados', image: '../assets/img/AzulejoNegro.png' },
    { id: 'acab-003', name: 'Cerámica Hexagonal Blanco Brillante 20x23', brand: 'Celima', price: 28.76, category: 'acabados', image: '../assets/img/AzulejoHexagonal.png' },
    { id: 'acab-004', name: 'Azulejo Mix Celestes Con Tornasol 2x2 Cm', brand: 'Gala', price: 39.84, category: 'acabados', image: '../assets/img/AzulejoAzul.png' },
    { id: 'acab-005', name: 'Porcelanato Tipo Madera 60x60 cm', brand: 'Celima', price: 39.90, category: 'acabados', image: '../assets/img/PorcelanatoMadera.jpg' },
    { id: 'acab-006', name: 'COMBO Pintura Latex Duralatex CPP Blanco 4 galones + Sellador', brand: 'CPP', price: 680.00, category: 'acabados', image: '../assets/img/ComboCPP.png' },

    // Index
    { id: 'idx-001', name: 'Taladro Percutor Inalámbrico 20V', brand: 'DeWalt', price: 450.00, category: 'herramientas', image: '../assets/img/Taladroinalambrico.png' },
    { id: 'idx-002', name: 'Cemento Portland Tipo I - 42.5 kg', brand: 'Inka', price: 28.50, category: 'materiales', image: '../assets/img/CementoPortland.png' },
    { id: 'idx-003', name: 'Porcelanato Tipo Madera 60x60 cm', brand: 'Celima', price: 39.90, category: 'pisos', image: '../assets/img/PorcelanatoMadera.jpg' },
    { id: 'idx-004', name: 'Mezcladora Ducha Negro Mate', brand: 'Orange', price: 179.00, category: 'gasfiteria', image: '../assets/img/MezcladoraDuchaNegroMate.jpg' }
];

// Función de búsqueda
function realizarBusqueda(event) {
    if (event) event.preventDefault();

    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim().toLowerCase();

    if (query === '') {
        alert('Por favor ingresa un término de búsqueda');
        return false;
    }

    // Guardar búsqueda
    const resultados = todosLosProductos.filter(producto =>
        producto.name.toLowerCase().includes(query) ||
        producto.brand.toLowerCase().includes(query) ||
        producto.category.toLowerCase().includes(query)
    );

    // Guardar resultados y búsqueda
    const dataBusqueda = {
        query: query,
        resultados: resultados,
        timestamp: new Date().toISOString()
    };

    sessionStorage.setItem('busquedaActual', JSON.stringify(dataBusqueda));

    // Redirigir a página de resultados
    window.location.href = window.resolvePath ? window.resolvePath('pages/resultados-busqueda.html') : 'pages/resultados-busqueda.html';

    return false;
}

// Sugerencias en tiempo real
function inicializarSugerencias() {
    const searchInput = document.getElementById('search-input');
    const suggestionsDiv = document.getElementById('search-suggestions');

    if (!searchInput || !suggestionsDiv) return;

    searchInput.addEventListener('input', function () {
        const query = this.value.trim().toLowerCase();

        if (query.length < 2) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        // Buscar coincidencias
        const sugerencias = todosLosProductos
            .filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query)
            )
            .slice(0, 5); // Máximo 5 sugerencias

        if (sugerencias.length === 0) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        // Mostrar sugerencias
        suggestionsDiv.innerHTML = sugerencias.map(producto => `
            <div class="suggestion-item" style="padding: 10px; border-bottom: 1px solid #eee; cursor: pointer;" 
                 onclick="seleccionarSugerencia('${producto.name}')">
                <strong>${producto.name}</strong><br>
                <small style="color: #666;">${producto.brand} - S/ ${producto.price}</small>
            </div>
        `).join('');

        suggestionsDiv.style.display = 'block';
    });

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });
}

function seleccionarSugerencia(nombre) {
    document.getElementById('search-input').value = nombre;
    document.getElementById('search-suggestions').style.display = 'none';
    realizarBusqueda();
}

// Sistema de filtros
function inicializarFiltros() {
    const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });
}

function aplicarFiltros() {
    // Obtener todos los filtros activos
    const filtrosActivos = {
        marcas: [],
        precios: [],
        categorias: []
    };

    // Recopilar marcas seleccionadas
    document.querySelectorAll('.filter-group[open] summary:contains("Marca") ~ ul input:checked').forEach(cb => {
        filtrosActivos.marcas.push(cb.parentElement.textContent.trim());
    });

    // Obtener productos visibles
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        let visible = true;

        // Aplicar filtro de marca
        if (filtrosActivos.marcas.length > 0) {
            const brandElement = card.querySelector('.brand');
            if (brandElement) {
                const brand = brandElement.textContent.trim();
                visible = filtrosActivos.marcas.some(marca => brand.includes(marca));
            }
        }

        // Mostrar/ocultar producto
        card.style.display = visible ? 'block' : 'none';
    });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    inicializarSugerencias();
    inicializarFiltros();
});

// Exportar para uso global
window.realizarBusqueda = realizarBusqueda;
window.seleccionarSugerencia = seleccionarSugerencia;
/* ═══════════════════════════════════════════════
   LEAFLET.JS — Interactive Map
   Lookwell Ladies Beauty Parlour, Sector 16, Airoli
   ═══════════════════════════════════════════════ */

(function () {
    const mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;

    const LAT = 19.1512;
    const LNG = 72.9935;

    const map = L.map('map', {
        scrollWheelZoom: false,
    }).setView([LAT, LNG], 16);

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map);

    // Custom purple marker icon
    const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #6B21A8, #F472B6);
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 16px rgba(107, 33, 168, 0.4);
                border: 3px solid white;
            ">
                <span style="
                    transform: rotate(45deg);
                    font-size: 16px;
                    color: white;
                    font-weight: bold;
                ">LW</span>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -42],
    });

    const marker = L.marker([LAT, LNG], { icon: markerIcon }).addTo(map);

    marker.bindPopup(`
        <div style="text-align: center; padding: 8px; font-family: 'Inter', sans-serif;">
            <strong style="font-size: 14px; color: #6B21A8;">Lookwell Ladies Parlour</strong><br>
            <span style="font-size: 12px; color: #78716C;">AL-1/431, Sector 16, Airoli</span><br>
            <a href="https://maps.google.com/?q=Lookwell+Ladies+Beauty+Parlour+%26+Classes+Airoli"
               target="_blank" rel="noopener noreferrer"
               style="font-size: 12px; color: #6B21A8; text-decoration: underline;">
                Get Directions →
            </a>
        </div>
    `);

    // Open popup by default
    marker.openPopup();

    // Enable scroll zoom on click
    map.on('click', () => {
        map.scrollWheelZoom.enable();
    });
})();

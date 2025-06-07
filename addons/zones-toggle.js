document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("zones-btn");
    const courtContainer = document.getElementById("court-container");

    const backgrounds = [
        "img/court.png",
        "img/court-zones.png",
        "img/court-zones-movement.png",
        "img/court-zones-movement-numbers.png"
    ];

    let currentIndex = 0;

    // Establece el fondo inicial
    courtContainer.style.backgroundImage = `url('${backgrounds[currentIndex]}')`;

    button.addEventListener("click", () => {
        // Avanza al siguiente fondo (y vuelve al principio si llega al final)
        currentIndex = (currentIndex + 1) % backgrounds.length;
        courtContainer.style.backgroundImage = `url('${backgrounds[currentIndex]}')`;
    });
});


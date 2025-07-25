export function openMenu() {
    const burgerBtn = document.getElementById("burger-btn");
    const githubIcon = document.getElementById("github-icon");
    const vercelIcon = document.getElementById("vercel-icon");

    burgerBtn.addEventListener("click", () => {
        const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
        const newState = !isExpanded;

        burgerBtn.setAttribute("aria-expanded", newState);
        burgerBtn.setAttribute("aria-label", newState ? "Cerrar menú" : "Abrir menú");

        githubIcon.classList.toggle("active");
        vercelIcon.classList.toggle("active");

        console.log(
            "%c🍔 Menú desplegable hecho con CSS puro y amor. ¡No jQuery aquí!",
            "color: #2ecc71;"
        );
    });
}

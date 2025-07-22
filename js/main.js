// IMPORTS
import * as components from './components/index.js';
import { signature } from './utils/signature.js';

// CALLING FUNCTIONS
document.addEventListener("DOMContentLoaded", async () => {
    components.themeDark('#theme-dark-btn');
    components.initCarousel('.carousel-container', '.carousel-imgs', '.carousel-advance', '.carousel-back');
    components.openMenu('#burger-nav', '#burger-text', '#burger-links');
    components.openModal('.modal-link', '#modal-container', '#modal-content', '#modal-iframe', '#modal-close');
    await components.showRandomMsg('#random-phrases');
    components.manageCookies('#cookies-bar', '#accept-cookies');
    await components.provisionalAlert('a[data-provisional]');
    signature('#signature-text');
});

console.group('EASTER EGG');
    console.log( // BUSSINESS CARD
        "%c" +
        " /\\_/\\   Frontend Dev | Maquetación Creativa 🛠️\n" +
        "( o.o )        HTML5 • CSS3 • JS Vanilla\n" +
        " > ^ <     \"sandokan.cat loves code & purrs\" 🐱\n" +
        "  ╰─▶            rn5pt3hec@mozmail.com",
        "color: #ff6d00; font-family: monospace; line-height: 1.3;"
    );
    console.log( // TECH GREETINGS
        "%c💻 ¡HOLA DEV! 👋\n" +
        "Este CV web es 100% vanilla JS y CSS custom.\n" +
        "👉 ¿Quieres echar un vistazo al código? https://github.com/sandokanCat \n" +
        "🚀 ¿Buscas un maquetador frontend? ¡Hablemos! https://linkedin.com/in/sandokanCat",
        "color: #2196f3; font-family: monospace; line-height: 1.5;"
    );
    console.log( // THANKS
        "%cGracias por inspeccionar. ¡Prepara más café, elige tu música y sigamos picando código! ☕️🎧",
        "color: #9b59b6; font-family: monospace; font-weight: 700;"
    );
    console.info( // FOOTER
        `© ${new Date().getFullYear()} sandokan.cat. Todos los derechos reservados.`
    );
console.groupEnd('EASTER EGG');

// A LITTE JOKE MORE
console.assert(
    document.title === "Gonzalo Cabezas - CV",
    `❌ ¡Meow alert! El título actual es '${document.title}'. ¡Git push urgente! 🐾`
);
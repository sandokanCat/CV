// 📥 IMPORTS ORDERED BY LAYER: CONFIG → UTILS → COMPONENTS
import {
    i18nConfig,
    getCarouselRefs/*,
    getModalRefs*/ } from './config.js';
import {
    replaceClass,
    getLocale,
    initI18n,
    initToggler,
    signature,
    manageCookies } from './utils/index.js';
import {
    themeDark,
    getLangMenuConfig,
    initCarousel,
    getBurgerConfig/*,
    openModal*/ } from './components/index.js';

// 🧠 APP INITIALIZATION SEQUENCE: FROM GLOBALS TO INTERACTIVE UI
document.addEventListener("DOMContentLoaded", async () => {
    const locale = getLocale();

    replaceClass('js-disabled', 'js-enabled');

    await initI18n({ ...i18nConfig, locale });

    await initToggler(await getLangMenuConfig(async (newLang) => {
        await initI18n({ ...i18nConfig, locale: newLang });
    
        await initToggler(await getBurgerConfig(newLang));
    }));
    
    themeDark('#theme-dark-btn', document.documentElement);
    
    await initCarousel(null, 0, 6000, locale, getCarouselRefs());

    const burgerConfig = await getBurgerConfig(locale);
    await initToggler(burgerConfig);

    signature('#signature-year');

    manageCookies('#cookies-bar', '#accept-cookies');

    // openModal(getModalRefs());
});

console.group('EASTER EGG');
    console.log( // BUSSINESS CARD
        "%c" +
        " /\\_/\\   Frontend Dev | Maquetación Creativa 🛠️\n" +
        "( o.o )        HTML5 • CSS3 • Vanilla JS\n" +
        " > ^ <     \"sandokan.cat loves code & purrs\" 🐱\n" +
        "  ╰─▶              dev@sandokan.cat",
        "color: #ff6d00; font-family: monospace; line-height: 1.3;"
    );
    console.log( // TECH GREETINGS
        "%c💻 ¡HOLA DEV! 👋\n" +
        "Este CV web es 100% Vanilla JS y custom CSS.\n" +
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
    (document.title === "Gonzalo Cabezas | Web Frontend developer") || 
    (document.title === "Gonzalo Cabezas | Desarrollador Frontend web") || 
    (document.title === "Gonzalo Cabezas | Desenvolupador Frontend web") 
    `❌ ¡Meow alert! El título actual es '${document.title}'. ¡Git push urgente! 🐾`
);
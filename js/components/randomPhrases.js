// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js";  // FETCH + STRUCTURE + FORMAT VALIDATION

// VARIABLES FOR DEVELOPMENT
const mode = "prod"; // CHANGE AS NEEDED: dev | ngrok | prod
const sources = {
    dev: "http://127.0.0.1:5500/js/data/phrases.json",
    ngrok: "https://example.ngrok-free.app/js/data/phrases.json",
    prod: "js/data/phrases.json"
};

// GLOBAL VARIABLES
let phrasesCache = []; // FULL JSON CACHED
let phrasesPool = [];  // TEMPORARY SHUFFLED LIST
let lastPhrase = null; // LAST SHOWN PHRASE
let intervalStarted = false; // PREVENT MULTIPLE INSTANCES

// FETCHES AND VALIDATES REMOTE PHRASES.JSON VIA PUBLIC LIBRARY
const loadPhrasesData = async () => {
    if (phrasesCache.length) return phrasesCache; // USE CACHE IF ALREADY LOADED

    // FETCH AND BASE VALIDATION
    const raw = await validateJSON(sources[mode], {
        requireContent: true, // FAIL IF EMPTY JSON
        debug: mode !== "prod" // LOG ONLY IN DEV OR NGROK
    });

    const locale = document.documentElement.lang?.toLowerCase() || "es-es"; // FULL LOCALE (e.g., es-es)
    const lang = locale.split("-")[0]; // BASE LANGUAGE (e.g., es)

    // FILTER VALID OBJECTS WITH LOCALE/LANG FALLBACK
    phrasesCache = raw.filter(p =>
        p && typeof p === "object" && (p[locale] || p[lang] || p["es-es"])
    );

    // THROW IF RESULTING CACHE IS EMPTY
    if (!phrasesCache.length)
        throw new Error(`EMPTY OR INVALID JSON DATA: ${JSON.stringify(raw)}`);

    return phrasesCache; // RETURN FILTERED PHRASES
};

// INIT RANDOM PHRASES
export async function showRandomMsg(selector = "#random-phrases") {
    if (intervalStarted) return; // PREVENT MULTIPLE LOOPS
    intervalStarted = true;

    const shuffle = (arr) => { // FISHER–YATES
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    try {
        await loadPhrasesData(); // ENSURE PHRASES ARE LOADED
        const locale = document.documentElement.lang?.toLowerCase() || "es-es"; // DETECT FULL LOCALE
        const lang = locale.split("-")[0]; // FALLBACK TO BASE LANGUAGE (e.g., 'es')
        const MAX_SHUFFLE_ATTEMPTS = 10; // LIMIT LOOP TO AVOID INFINITE SHUFFLES

        // MAIN LOOP TO DISPLAY RANDOM PHRASES
        const loop = () => {
            if (!phrasesPool.length) { // REFILL POOL IF EMPTY (SHUFFLED COPY OF CACHE)
                let attempts = 0;
                do {
                    phrasesPool = shuffle([...phrasesCache]); // NEW SHUFFLED ARRAY
                    attempts++;
                    if (phrasesCache.length <= 1 || attempts >= MAX_SHUFFLE_ATTEMPTS) break;

                } while ( // AVOID REPEATING LAST PHRASE ON NEXT LOOP
                    phrasesPool[phrasesPool.length - 1][locale] === lastPhrase?.[locale] ||
                    phrasesPool[phrasesPool.length - 1][lang] === lastPhrase?.[lang]
                );
            }

            // PICK NEXT RANDOM PHRASE
            const selected = phrasesPool.pop();
            lastPhrase = selected;

            // FIND TARGET ELEMENT
            const target = document.querySelector(selector);
            if (!target) {
                console.error(`${selector} NOT FOUND`);
                return;
            }

            target.classList.add("fade-out"); // TRIGGER FADE-OUT

            // UPDATE TEXT AFTER FADE
            setTimeout(() => {
                const liveTarget = document.querySelector(selector); // ENSURE TARGET STILL EXISTS
                if (!liveTarget) return;

                // SHOW TEXT WITH LOCALE/LANG FALLBACK
                liveTarget.textContent =
                    selected[locale] || selected[lang] || selected["es-es"] || "";
                liveTarget.classList.remove("fade-out"); // TRIGGER FADE-IN
            }, 1200);

            setTimeout(loop, 12000); // RECURSIVE TIMER
        };

        loop(); // START LOOP
    } catch (err) {
        console.error("randomPhrases.js ERROR", sources[mode], "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
    }
}
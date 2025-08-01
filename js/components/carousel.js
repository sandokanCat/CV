// IMPORTS
import { validateCarousel } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateCarousel.js"; // FETCH + STRUCTURE + FORMAT VALIDATION
import { getLocale, fallbackLocale } from "../utils/i18n.js"; // USE GLOBAL i18n LOCALE DETECTION

// GLOBAL VARIABLES
const json = "js/data/carousel.json"; // SOURCE JSON FILE
let cachedCarouselImgs = null;
let currentLocaleForCarousel = null;

// CACHED DOM ELEMENTS
const container = document.querySelector('.carousel-container');
const track = container.querySelector('.carousel-track');
const scrollbar = container.querySelector('.carousel-scrollbar');
const advanceBtn = container.querySelector('.carousel-advance');
const backBtn = container.querySelector('.carousel-back');
const imgWrapper = container.querySelector('.carousel-imgs');

// FETCHES AND VALIDATES REMOTE JSON VIA PUBLIC LIBRARY
const loadCarouselData = async (forceReload = false) => {
    if (forceReload || !cachedCarouselImgs) {
        cachedCarouselImgs = await validateCarousel(json);
    }
    return cachedCarouselImgs;
}

// UPDATE ONLY IMG ALTS BASED ON CURRENT LOCALE
export async function updateCarouselAlts(locale = getLocale(), validImgs = null) {
    if (locale === currentLocaleForCarousel) return;
    currentLocaleForCarousel = locale;

    const imgs = track.querySelectorAll("img.modal-link");
    if (!imgs.length) return;

    const data = validImgs || await loadCarouselData();

    imgs.forEach((img, i) => {
        const altData = data[i]?.alt;
        if (altData) {
            img.alt = altData[locale] || altData[fallbackLocale] || Object.values(altData)[0] || '';
        }
    });
}

// INIT CAROUSEL WITH AUTOSCROLL + MANUAL CONTROLS
export async function initCarousel(
	imgs = null, // OPTIONAL: ALLOW PASSING CUSTOM IMG ARRAY (SKIPS FETCH)
	startIndex = 0, // OPTIONAL: INITIAL SLIDE INDEX
	interval = 6000, // OPTIONAL: AUTOSCROLL INTERVAL
    locale = getLocale() // CURRENT LOCALE
) {
	try {
		// FETCH + VALIDATE IMAGES (IF NOT PASSED MANUALLY)
		const validImgs = imgs || await loadCarouselData();
        
		if (!validImgs.length) throw new Error("initCarousel: EMPTY VALID IMAGE LIST");

		// MANDATORY ELEMENTS CHECK
		if (!track || !scrollbar || !imgWrapper)
			throw new Error("initCarousel: MISSING REQUIRED ELEMENTS IN CONTAINER");

		let index = startIndex, timer;

		track.innerHTML = ''; // CLEAN PREVIOUS SLIDES

		// RENDER <picture> SLIDES
		validImgs.forEach(({ webp, png, alt }) => {
			const li = document.createElement("li");

			const picture = document.createElement("picture");

			const sourceWebp = document.createElement("source"); // SOURCE WEBP
			sourceWebp.type = "image/webp";
			sourceWebp.srcset = webp.srcSet.trim();

			const sourcePng = document.createElement("source"); // SOURCE PNG
			sourcePng.srcset = png.srcSet.trim();

			const img = document.createElement("img"); // IMG FALLBACK
			img.src = png.fallback;
            img.alt = ''; // SET TEMPORARY EMPTY ALT – UPDATED LATER BY i18n
			img.className = "modal-link";
			img.setAttribute("data-modal", png.fallback);
			img.decoding = "async";
			img.loading = "lazy";

			picture.appendChild(sourceWebp); // APPEND CHILDREN TO PICTURE
			picture.appendChild(sourcePng);
			picture.appendChild(img);

			li.appendChild(picture); // APPEND PICTURE TO LI

			track.appendChild(li); // APPEND LI TO TRACK
		});

		// MOVE TRACK + UPDATE SCROLLBAR
		const update = () => {
			track.style.transform = `translateX(${-index * 100}%)`;
			const width = 100 / validImgs.length;
			scrollbar.style.setProperty('--scrollbar-offset', `${index * width}%`);
			scrollbar.style.setProperty('--scrollbar-width', `${width}%`);
			clearTimeout(timer);
			timer = setTimeout(() => {
				index = (index + 1) % validImgs.length;
				update();
			}, interval);
		};

		// MANUAL BUTTON CONTROLS
		advanceBtn?.addEventListener("click", () => {
			index = (index + 1) % validImgs.length;
			update();
		});
		backBtn?.addEventListener("click", () => {
			index = (index - 1 + validImgs.length) % validImgs.length;
			update();
		});

		// AUTOSCROLL PAUSE ON HOVER
		imgWrapper.addEventListener("mouseenter", () => clearTimeout(timer));
		imgWrapper.addEventListener("mouseleave", update);

		update(); // START LOOP

        await updateCarouselAlts(locale, validImgs); // SET i18n ALT TEXTS

	} catch (err) {
		console.error("carousel.js ERROR", json, "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
	}
}
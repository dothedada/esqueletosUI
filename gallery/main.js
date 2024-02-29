document.querySelectorAll('.gallery').forEach((gal) => {
    const opts = {
        nextTXT: '>',
        prevTXT: '<',
        slidesMarkerTXT: '·',
        playTXT: 'Play',
        stopTXT: 'Stop',

        transition: 'alpha', // horizontal - vertical
        firstSlide: gal.getAttribute('firstSlide') ?? 0,
        autoplay: JSON.parse(gal.getAttribute('autoplay')) ?? true,
        autoStart: JSON.parse(gal.getAttribute('autoplayStar')) ?? true,
        autoplaySecs: JSON.parse(gal.getAttribute('autoplaySeconds'))
            ? JSON.parse(gal.getAttribute('autoplaySeconds')) * 1000
            : 4000,
        posMarker: JSON.parse(gal.getAttribute('slideMarkers')) ?? true,
        captionOverlay: JSON.parse(gal.getAttribute('captionsOverlay')) ?? true,
    };

    // TODO:
    // 1) que los puntos marquen cual es la slide actual
    // 2) que que la imagen pueda estar contenida
    // 3) crear la alternativa de transición entre slides
    // 4) limpiar el CSS (ojo al Seteo de dimensiones responsive de la galería)
    // 5) que las zonas activas de los botones > y < no sean la misma interfase visual del botón
    // 6) hacerla lo más accesible posible, arias y tales

    const gallery = gal;
    const galleryID = gal.getAttribute('id');
    const slideLib = [...gallery.children];
    const dots = document.createElement('div');
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');

    const displaySlide = (() => {
        const slide = { functions: [] };
        const set = (value) => {
            slide.functions.forEach((callback) => callback(value));
        };
        const subsCallback = (callback) => {
            slide.functions.push(callback);
        };

        return { set, subsCallback };
    })();

    let current = opts.firstSlide;
    if (/random/i.test(opts.firstSlide)) {
        current = Math.floor(Math.random() * slideLib.length);
    }
    if (+opts.firstSlide < slideLib.length && +opts.firstSlide > 0) {
        current = opts.firstSlide;
    }

    const nextSlide = () => {
        current = current < slideLib.length - 1 ? current + 1 : 0;
        displaySlide.set(current);
    };
    const prevSlide = () => {
        current = current > 0 ? current - 1 : slideLib.length - 1;
        displaySlide.set(current);
    };

    const renderSlide = (img) => {
        if (opts.transition === 'alpha') {
            const previousImg = document.querySelector(
                `#${galleryID} .gallery__slide--visible`,
            );
            if (previousImg) {
                previousImg.classList.remove('gallery__slide--visible');
            }
            slideLib[img].classList.add('gallery__slide--visible');
        }
        if (!opts.captionOverlay) {
            const totalHeight = slideLib[img].clientHeight;
            const captionHeight =
                slideLib[img].querySelector('figcaption').clientHeight;
            slideLib[img].querySelector('img').style.height =
                `${totalHeight - captionHeight}px`;
        }
    };
    displaySlide.subsCallback(renderSlide);
    displaySlide.set(current);

    let autoplay;
    if (opts.autoplay) {
        const playBtn = document.createElement('button');
        let play = opts.autoStart;

        const setAutoplay = () => {
            autoplay = setInterval(() => nextSlide(), opts.autoplaySecs);
        };
        if (play) setAutoplay();

        playBtn.textContent = play ? opts.stopTXT : opts.playTXT;
        playBtn.addEventListener('click', () => {
            if (!play) {
                setAutoplay();
                playBtn.textContent = opts.stopTXT;
                play = true;
                return;
            }
            clearInterval(autoplay);
            playBtn.textContent = opts.playTXT;
            play = false;
        });

        dots.appendChild(playBtn);

        gallery.addEventListener('mousemove', () => {
            if (!play) return;
            clearInterval(autoplay);
            setAutoplay()
        });
    }

    if (opts.posMarker) {
        slideLib.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.textContent = opts.slidesMarkerTXT;
            dot.addEventListener('click', () => {
                current = index;
                renderSlide(current);
                clearInterval(autoplay);
            });
            dots.appendChild(dot);
        });
    }

    prevBtn.classList.add('gallery__nav', 'gallery__nav--prev');
    prevBtn.textContent = opts.prevTXT;
    prevBtn.addEventListener('click', () => {
        prevSlide();
        clearInterval(autoplay);
    });

    nextBtn.classList.add('gallery__nav', 'gallery__nav--next');
    nextBtn.textContent = opts.nextTXT;
    nextBtn.addEventListener('click', () => {
        nextSlide();
        clearInterval(autoplay);
    });

    dots.classList.add('gallery__dots');
    gallery.append(prevBtn, dots, nextBtn);

    gallery.style.marginBottom = `${dots.clientHeight}px`;
});

document.querySelectorAll('.gallery').forEach((gal) => {
    const opts = {
        nextTXT: '>',
        prevTXT: '<',
        slidesMarkerTXT: '·',
        playTXT: 'Play',
        stopTXT: 'Stop',

        transition: 'alpha', // horizontal - vertical
        // firstSlide: 0,
        autoplay: JSON.parse(gal.getAttribute('autoplay')) ?? true,
        autoStart: JSON.parse(gal.getAttribute('autoplayStart')) ?? true,
        autoplaySecs: JSON.parse(gal.getAttribute('autoplaySeconds'))
            ? JSON.parse(gal.getAttribute('autoplaySeconds')) * 1000
            : 2000,
        posMarker: JSON.parse(gal.getAttribute('slideMarkers')) ?? true,
        captionOverlay: JSON.parse(gal.getAttribute('captionsOverlay')) ?? true,
        firstSlide: gal.getAttribute('firstSlide') ?? 0,
    };

    // TODO:
    // 3) crear la alternativa de transición entre slides
    // 4) limpiar el CSS (ojo al Seteo de dimensiones responsive de la galería)
    // 5) que las zonas activas de los botones > y < no sean la misma interfase visual del botón
    // 6) hacerla lo más accesible posible, arias y tales

    const gallery = gal;
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

    let current = 0;
    if (opts.firstSlide === 'random') {
        current = Math.floor(Math.random() * slideLib.length);
    }
    if (+opts.firstSlide < slideLib.length && +opts.firstSlide > 0) {
        current = +opts.firstSlide;
    }

    const nextSlide = () => {
        current = current < slideLib.length - 1 ? current + 1 : 0;
        displaySlide.set(current);
    };
    const prevSlide = () => {
        current = current > 0 ? current - 1 : slideLib.length - 1;
        displaySlide.set(current);
    };

    // prettier-ignore
    const renderSlide = (img) => {
        if (opts.transition === 'alpha') {
            const prevIMG = gallery.querySelector('.gallery__slide--visible');
            if (prevIMG) prevIMG.classList.remove('gallery__slide--visible');
            slideLib[img].classList.add('gallery__slide--visible');
        }
        if (!opts.captionOverlay) {
            const totalHeight = slideLib[img].clientHeight;
            const captionHeight = slideLib[img].querySelector('figcaption').clientHeight;
            slideLib[img].querySelector('img').style.height = `${totalHeight - captionHeight}px`;
        }
        const slideImg = slideLib[img].querySelector('img')
        if (slideImg.getAttribute('data-contained') === 'true') {
            slideImg.style.objectFit = 'contain'
        }
    };
    displaySlide.subsCallback(renderSlide);

    let removeAutoplay;
    if (opts.autoplay) {
        let play = opts.autoStart;
        let autoplay;

        const playBtn = document.createElement('button')
        playBtn.classList.add('dots__play');
        playBtn.textContent = play ? opts.stopTXT : opts.playTXT;
        dots.appendChild(playBtn);

        const setAutoplay = () => {
            autoplay = setInterval(() => nextSlide(), opts.autoplaySecs);
            playBtn.textContent = opts.stopTXT;
            play = true;
        };
        if (play) setAutoplay();
        removeAutoplay = () => {
            clearInterval(autoplay);
            playBtn.textContent = opts.playTXT;
            play = false;
        };

        playBtn.addEventListener('click', () => {
            if (!play) {
                setAutoplay();
                return;
            }
            removeAutoplay();
        });
        gallery.addEventListener('mousemove', () => {
            if (!play) return;
            clearInterval(autoplay);
            setAutoplay();
        });
    }

    if (opts.posMarker) {
        slideLib.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dots__btn');
            dot.textContent = opts.slidesMarkerTXT;

            dot.addEventListener('click', () => {
                displaySlide.set(index);
                current = index;
                removeAutoplay();
            });
            dots.appendChild(dot);
        });

        const markCurrent = (slide) => {
            const marked = dots.querySelector('.dots__btn--active');
            if (marked) marked.classList.remove('dots__btn--active');
            dots.children[slide + 1].classList.add(
                'dots__btn--active',
            );
        };
        displaySlide.subsCallback(markCurrent);
    }

    prevBtn.classList.add('gallery__nav', 'gallery__nav--prev');
    prevBtn.textContent = opts.prevTXT;
    prevBtn.addEventListener('click', () => {
        prevSlide();
        removeAutoplay();
    });

    nextBtn.classList.add('gallery__nav', 'gallery__nav--next');
    nextBtn.textContent = opts.nextTXT;
    nextBtn.addEventListener('click', () => {
        nextSlide();
        removeAutoplay();
    });

    dots.classList.add('gallery__dots');
    gallery.append(prevBtn, dots, nextBtn);

    gallery.style.marginBottom = `${dots.clientHeight}px`;
    displaySlide.set(current);
});

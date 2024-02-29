document.querySelectorAll('.gallery').forEach((gal) => {
    const opts = {
        nextTXT: '>',
        prevTXT: '<',
        slidesMarkerTXT: '·',
        transition: 'alpha', // horizontal - vertical
        playTXT: 'Play',
        stopTXT: 'Stop',
        autoplaySecs: JSON.parse(gal.getAttribute('autoplaySeconds'))
            ? JSON.parse(gal.getAttribute('autoplaySeconds')) * 1000
            : 4000,
        firstSlide: gal.getAttribute('firstSlide') ?? 0,
        autoplay: JSON.parse(gal.getAttribute('autoplay')) ?? true,
        posMarker: JSON.parse(gal.getAttribute('slideMarkers')) ?? true,
        captionOverlay: JSON.parse(gal.getAttribute('captionsOverlay')) ?? true,
    };

    const gallery = gal;
    const galleryID = gal.getAttribute('id');
    const slideLib = [...gallery.children];
    const dots = document.createElement('div');

    let current;
    if (/random/i.test(opts.firstSlide)) {
        current = Math.floor(Math.random() * slideLib.length);
    }
    if (+opts.firstSlide < slideLib.length && +opts.firstSlide > 0) {
        current = opts.firstSlide;
    }
    if (!current) current = 0;

    let autoplay;

    // Slide render

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
    renderSlide(current);

    if (opts.autoplay) {
        const playBtn = document.createElement('button');
        let play = true;

        const setAutoplay = () => {
            autoplay = setInterval(() => {
                current = current < slideLib.length - 1 ? current + 1 : 0;
                renderSlide(current);
            }, opts.autoplaySecs);
        };
        setAutoplay();

        playBtn.textContent = opts.stopTXT;
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

    const next = document.createElement('button');
    next.classList.add('gallery__nav', 'gallery__nav--next');
    next.textContent = opts.nextTXT;
    next.addEventListener('click', () => {
        current = current < slideLib.length - 1 ? current + 1 : 0;
        renderSlide(current);
        clearInterval(autoplay);
    });

    const prev = document.createElement('button');
    prev.classList.add('gallery__nav', 'gallery__nav--prev');
    prev.textContent = opts.prevTXT;
    prev.addEventListener('click', () => {
        current = current > 0 ? current - 1 : slideLib.length - 1;
        renderSlide(current);
        clearInterval(autoplay);
    });

    document.body.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            current = current > 0 ? current - 1 : slideLib.length - 1;
            renderSlide(current);
            clearInterval(autoplay);
        }
        if (event.key === 'ArrowRight') {
            current = current < slideLib.length - 1 ? current + 1 : 0;
            renderSlide(current);
            clearInterval(autoplay);
        }
    });

    dots.classList.add('gallery__dots');
    gallery.append(prev, dots, next);

    gallery.style.marginBottom = `${dots.clientHeight}px`;
});

document.querySelectorAll('.gallery').forEach((gal) => {
    const opts = {
        nextTXT: '>',
        prevTXT: '<',
        slidesMarkerTXT: '·',
        imageSize: 'fill', // contain
        transition: 'alpha', // horizontal - vertical
        playTXT: 'Play',
        stopTXT: 'Stop',
        autoplayMiliseconds: 3000,
        firstImg: 0,
        autoplay: true,
        posMarker: false,
        captionOverlay: false,
    };

    const gallery = gal;
    const galleryID = gal.getAttribute('id');
    const slidesLibrary = [...gallery.children];
    const dots = document.createElement('div');
    let current = opts.firstImg > slidesLibrary.length ? opts.firstImg : 0;
    let autoplay;

    const makeVisible = (image) => {
        if (opts.transition === 'alpha') {
            const previousImg = document.querySelector(
                `#${galleryID} .gallery__slide--visible`,
            );
            if (previousImg) {
                previousImg.classList.remove('gallery__slide--visible');
            }
            slidesLibrary[image].classList.add('gallery__slide--visible');
            if (!opts.captionOverlay) {
                console.log(slidesLibrary[image].querySelector('img').clientHeight)
                console.log(slidesLibrary[image].querySelector('figcaption').clientHeight)
            }
        }
    };
    makeVisible(current);

    if (opts.autoplay) {
        const playBtn = document.createElement('button');
        let play = true;

        const setAutoplay = () => {
            autoplay = setInterval(() => {
                current = current < slidesLibrary.length - 1 ? current + 1 : 0;
                makeVisible(current);
            }, opts.autoplayMiliseconds);
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
        slidesLibrary.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.textContent = opts.slidesMarkerTXT;
            dot.addEventListener('click', () => {
                current = index;
                makeVisible(current);
                clearInterval(autoplay);
            });
            dots.appendChild(dot);
        });
    }

    const next = document.createElement('button');
    next.classList.add('gallery__nav', 'gallery__nav--next');
    next.textContent = opts.nextTXT;
    next.addEventListener('click', () => {
        current = current < slidesLibrary.length - 1 ? current + 1 : 0;
        makeVisible(current);
        clearInterval(autoplay);
    });

    const prev = document.createElement('button');
    prev.classList.add('gallery__nav', 'gallery__nav--prev');
    prev.textContent = opts.prevTXT;
    prev.addEventListener('click', () => {
        current = current > 0 ? current - 1 : slidesLibrary.length - 1;
        makeVisible(current);
        clearInterval(autoplay);
    });

    document.body.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            current = current > 0 ? current - 1 : slidesLibrary.length - 1;
            makeVisible(current);
            clearInterval(autoplay);
        }
        if (event.key === 'ArrowRight') {
            current = current < slidesLibrary.length - 1 ? current + 1 : 0;
            makeVisible(current);
            clearInterval(autoplay);
        }
    });

    dots.classList.add('gallery__dots');
    gallery.append(prev, dots, next);

    gallery.style.marginBottom = `${dots.clientHeight}px`;
});

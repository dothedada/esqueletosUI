document.querySelectorAll('.gallery').forEach((gal) => {
    const opts = {
        nextTXT: '»',
        prevTXT: '«',
        playTXT: '▶',
        stopTXT: '■',

        transition: gal.getAttribute('transition') === 'hor' ? 'hor' : 'alpha',
        firstSlide: gal.getAttribute('firstSlide') ?? 0,
        autoplay: JSON.parse(gal.getAttribute('autoplay')) ?? true,
        autoStart: JSON.parse(gal.getAttribute('autoplayStart')) ?? false,
        autoplaySecs: JSON.parse(gal.getAttribute('autoplaySeconds'))
            ? JSON.parse(gal.getAttribute('autoplaySeconds')) * 1000
            : 5000,
        posMarker: JSON.parse(gal.getAttribute('slideMarkers')) ?? true,
        captionOverlay: JSON.parse(gal.getAttribute('captionsOverlay')) ?? true,
    };

    // TODO:
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

    if (opts.transition === 'alpha') {
        slideLib.forEach((img) => img.classList.add('slideAlpha'));
    }
    let reel;
    let frame;
    if (opts.transition === 'hor') {
        reel = document.createElement('div');
        frame = document.createElement('div')
        reel.classList.add('container');
        frame.classList.add('frame')
        frame.append(reel)
        gallery.append(frame);
        slideLib.forEach((image, index) => {
            const img = image;
            reel.append(img);
            img.style.left = `${index * frame.clientWidth}px`;
        });
    }

    const renderSlide = (img) => {
        if (opts.transition === 'alpha') {
            const prevIMG = gallery.querySelector('.slideAlpha--visible');
            if (prevIMG) prevIMG.classList.remove('slideAlpha--visible');
            slideLib[img].classList.add('slideAlpha--visible');
        }
        if (opts.transition === 'hor') {
            reel.style.left = `-${img * frame.clientWidth}px`;
        }
        if (!opts.captionOverlay) {
            const totalHeight = slideLib[img].clientHeight;
            const captionHeight =
                slideLib[img].querySelector('figcaption').clientHeight;

            slideLib[img].querySelector('img').style.height =
                `${totalHeight - captionHeight}px`;
        }
        const slideImg = slideLib[img].querySelector('img');
        if (slideImg.getAttribute('data-contained') === 'true') {
            slideImg.style.objectFit = 'contain';
        }
    };
    displaySlide.subsCallback(renderSlide);

    let removeAutoplay;
    if (opts.autoplay) {
        let play = opts.autoStart;
        let autoplay;

        const playBtn = document.createElement('button');
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
        frame.addEventListener('mouseenter', () => {
            if (!play) return;
            clearInterval(autoplay);
        });
        frame.addEventListener('mouseleave', () => {
            if (!play) return;
            setAutoplay();
        });
    }

    if (opts.posMarker) {
        slideLib.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dots__btn');

            dot.addEventListener('click', () => {
                current = index
                displaySlide.set(current);
                removeAutoplay();
            });
            dots.appendChild(dot);
        });

        const markCurrent = (slide) => {
            const marked = dots.querySelector('.dots__btn--active');
            if (marked) marked.classList.remove('dots__btn--active');
            dots.children[slide + 1].classList.add('dots__btn--active');
        };
        displaySlide.subsCallback(markCurrent);
    }

    prevBtn.classList.add('nav__btn', 'nav__btn--prev');
    const prevBtnUI = document.createElement('span');
    prevBtnUI.classList.add('nav__btnUI--prev');
    prevBtnUI.textContent = opts.prevTXT;
    prevBtn.appendChild(prevBtnUI);
    prevBtn.addEventListener('click', () => {
        prevSlide();
        removeAutoplay();
    });

    nextBtn.classList.add('nav__btn', 'nav__btn--next');
    const nextBtnUI = document.createElement('span');
    nextBtnUI.classList.add('nav__btnUI--next');
    nextBtnUI.textContent = opts.nextTXT;
    nextBtn.appendChild(nextBtnUI);
    nextBtn.addEventListener('click', () => {
        nextSlide();
        removeAutoplay();
    });

    dots.classList.add('gallery__dots');
    gallery.append(prevBtn, dots, nextBtn);

    gallery.style.marginBottom = `${dots.clientHeight}px`;
    displaySlide.set(current);
});

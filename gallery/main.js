document.querySelectorAll('.gallery').forEach((gal) => {
    const settings = {
        nextTXT: '>',
        prevTXT: '<',
        dotTXT: '·',
        mode: 'alpha', // horizontal - vertical
    };

    const gallery = gal;
    const galleryID = gal.getAttribute('id');
    const slidesLibrary = [...gallery.children];
    if (slidesLibrary.length < 2) return;

    let current = 0;

    const makeVisible = (image) => {
        if (settings.mode === 'alpha') {
            const previousImg = document.querySelector(
                `#${galleryID} .gallery__slide--visible`,
            );
            if (previousImg)
                previousImg.classList.remove('gallery__slide--visible');
            slidesLibrary[image].classList.add('gallery__slide--visible');
        }
    };

    makeVisible(current);

    const next = document.createElement('button');
    next.classList.add('gallery__nav', 'gallery__nav--next');
    next.textContent = settings.nextTXT;
    next.addEventListener('click', () => {
        current = current < slidesLibrary.length - 1 ? current + 1 : 0;
        makeVisible(current);
        console.log(current);
    });

    const prev = document.createElement('button');
    prev.classList.add('gallery__nav', 'gallery__nav--prev');
    prev.textContent = settings.prevTXT;
    prev.addEventListener('click', () => {
        current = current > 0 ? current - 1 : slidesLibrary.length - 1;
        makeVisible(current);
        console.log(current);
    });

    const dots = document.createElement('div');
    dots.classList.add('gallery__dots');
    slidesLibrary.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.textContent = settings.dotTXT;
        dot.addEventListener('click', () => {
            current = index;
            console.log(current);
            makeVisible(current);
        });
        dots.appendChild(dot);
    });

    gallery.append(prev, dots, next);
	gallery.style.marginBottom = `${dots.clientHeight}px`
});

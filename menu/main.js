const menu = document.querySelector('.mainMenu');
const menuItems = menu.querySelector('.mainMenu__items');
const menuItemsWidth = [...menuItems.children].map((item) => item.clientWidth);
let menuBtn;
let newMenuBar;

const opts = {
    gap: +getComputedStyle(menuItems).gap.slice(0, -2),
    hideAll: false,
    openMenuTXT: 'Menú',
    hideMenuTXT: 'Cerrar',
    viewMoreTXT: 'Ver más',
};

const setMenuAria = (visible) => {
    menuBtn.ariaExpanded = visible;
    menuItems.ariaHidden = !visible;
};

const closeMenu = () => {
    if (menuBtn.ariaExpanded !== 'true') return;
    if (!opts.hideAll) {
        menuBtn.textContent = opts.viewMoreTXT;
        newMenuBar.classList.remove('hidden');
    }
    menuItems.classList.add('mainMenu__items--hidden');
    setMenuAria(false);
};

const toggleMenu = () => {
    if (!opts.hideAll) {
        menuBtn.textContent = opts.hideMenuTXT;
        newMenuBar.classList.toggle('hidden');
    }
    setMenuAria(!JSON.parse(menuBtn.ariaExpanded));
    menuItems.classList.toggle('mainMenu__items--hidden');
};

const renderMenu = () => {
    const menuSpace = menu.clientWidth - menu.firstElementChild.clientWidth;

    if (menuBtn) {
        menuItems.classList.remove('mainMenu__items--small');
        menuItems.classList.remove('mainMenu__items--hidden');
        menuBtn.remove();
        newMenuBar.remove();
    }

    if (menuSpace > menuItems.clientWidth) return;

    menuBtn = document.createElement('button');
    menuBtn.classList.add('mainMenu__btn');
    menuBtn.setAttribute('aria-controls', 'menuItems');
    menuBtn.textContent = opts.hideAll ? opts.openMenuTXT : opts.viewMoreTXT;
    menu.appendChild(menuBtn);

    if (!opts.hideAll) {
        const newMenuSpace = menuSpace - menuBtn.clientWidth;
        newMenuBar = document.createElement('ul');
        newMenuBar.classList.add('mainMenu__items');
        const newMenuItems = [...menuItems.cloneNode(true).children];

        menuItemsWidth.reduce((count, item, index) => {
            if (count - item - opts.gap > 0) {
                newMenuBar.appendChild(newMenuItems[index]);
            }
            return count - item - opts.gap;
        }, newMenuSpace);

        menu.insertBefore(newMenuBar, menuBtn);
    }

    setMenuAria(false);

    menuItems.classList.add('mainMenu__items--small');
    menuItems.classList.add('mainMenu__items--hidden');

    menuItems.addEventListener('click', toggleMenu)
    menuBtn.addEventListener('click', toggleMenu);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu()
    });
};
renderMenu();

const debounce = (callback, wait = 100) => {
    let timer;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(callback, wait);
    };
};

window.addEventListener('resize', debounce(renderMenu, 150));

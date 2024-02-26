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
    menuBtn.setAttribute('aria-expanded', 'false');
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

    menuItems.classList.add('mainMenu__items--small');
    menuItems.classList.add('mainMenu__items--hidden');
    menuItems.setAttribute('aria-hidden', 'true');

    menuBtn.addEventListener('click', () => {
        console.log('aja?')
        if (menuBtn.getAttribute('aria-expanded') === 'true') {
            menuBtn.setAttribute('aria-expanded', 'false');
            menuItems.setAttribute('aria-hidden', 'true');
            menuItems.classList.add('mainMenu__items--hidden')
            if (!opts.hideAll) {
                menuBtn.textContent = opts.viewMoreTXT
                newMenuBar.classList.remove('hidden')
            }
            return;
        }
        menuBtn.setAttribute('aria-expanded', 'true');
        menuItems.setAttribute('aria-hidden', 'false');
        menuItems.classList.remove('mainMenu__items--hidden')
        if (!opts.hideAll) {
            menuBtn.textContent = opts.hideMenuTXT
            newMenuBar.classList.add('hidden')
        }
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

// const menuBtn = document.createElement('button');
// menuBtn.classList.add('mainMenu__btn');
// menuBtn.setAttribute('aria-controls', 'menuItems');
// menuBtn.setAttribute('aria-expanded', 'false');
// menuBtn.textContent = settings.hideAllElements
//     ? settings.openMenuText
//     : settings.showMoreText;
//
// menuBtn.addEventListener('click', () => {
//     if (menuBtn.getAttribute('aria-expanded') === 'false') {
//         menuItems.classList.remove('mainMenu__items--hidden');
//         menuItems.setAttribute('aria-hidden', 'false');
//         menuBtn.setAttribute('aria-expanded', 'true');
//         menuBtn.textContent = settings.closeMenuText;
//         return;
//     }
//     menuItems.classList.add('mainMenu__items--hidden');
//     menuItems.setAttribute('aria-hidden', 'true');
//     menuBtn.setAttribute('aria-expanded', 'false');
//     menuBtn.textContent = settings.hideAllElements
//         ? settings.openMenuText
//         : settings.showMoreText;
// });
//
// const renderSmallMenu = () => {
//     menuItems.classList.remove('mainMenu__items--small');
//     menuItems.setAttribute('aria-hidden', 'true');
//     menuBtn.setAttribute('aria-expanded', 'false');
//     menuBtn.remove();
//
//     if (menu.clientWidth - menulogo.clientWidth < menuItems.clientWidth) {
//         menuItems.classList.add('mainMenu__items--small');
//         menuItems.classList.add('mainMenu__items--hidden');
//         menu.appendChild(menuBtn);
//     }
// };
// renderSmallMenu();

// window.addEventListener('resize', debounce(renderSmallMenu, 100));

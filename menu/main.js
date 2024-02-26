const menu = document.querySelector('.mainMenu');
const menulogo = menu.querySelector('.mainMenu__logo');
const menuItems = menu.querySelector('.mainMenu__items');

const settings = {
    hideAllElements: true,
    openMenuText: 'Menú',
    closeMenuText: 'Cerrar',
    showMoreText: 'Ver más',
};

const menuBtn = document.createElement('button');
menuBtn.classList.add('mainMenu__btn');
menuBtn.setAttribute('aria-controls', 'menuItems');
menuBtn.setAttribute('aria-expanded', 'false');
menuBtn.textContent = settings.hideAllElements
    ? settings.openMenuText
    : settings.showMoreText;

menuBtn.addEventListener('click', () => {
    if (menuBtn.getAttribute('aria-expanded') === 'false') {
        menuItems.classList.remove('mainMenu__items--hidden');
        menuItems.setAttribute('aria-hidden', 'false');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.textContent = settings.closeMenuText;
        return;
    }
    menuItems.classList.add('mainMenu__items--hidden');
    menuItems.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = settings.hideAllElements
        ? settings.openMenuText
        : settings.showMoreText;
});

const renderSmallMenu = () => {
    menuItems.classList.remove('mainMenu__items--small');
    menuItems.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.remove();

    if (menu.clientWidth - menulogo.clientWidth < menuItems.clientWidth) {
        menuItems.classList.add('mainMenu__items--small');
        menuItems.classList.add('mainMenu__items--hidden');
        menu.appendChild(menuBtn);
    }
};
renderSmallMenu();

const debounce = (callback, wait = 100) => {
    let timer;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(callback, wait);
    };
};

window.addEventListener('resize', debounce(renderSmallMenu, 100));

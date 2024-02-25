export default function dropdown() {
    const showInfo = (container, visible) => {
        if (!container) return;
        container.querySelector('div').classList.toggle('hidden');
        container
            .querySelector('button')
            .setAttribute('aria-expanded', visible);
        container.setAttribute('data-DD_visible', visible);
    };

    // NOTE: cierra ventana en caso de click afuera, escape o focusOut
    document.addEventListener('click', (event) => {
        const openElement = document.querySelector('[data-DD_visible="true"]');
        if (!openElement || openElement.contains(event.target)) return;
        showInfo(openElement, 'false');
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            showInfo(
                document.querySelector('[data-DD_visible="true"]'),
                'false',
            );
        }
    });

    document.addEventListener('focusout', (event) => {
        const openElement = document.querySelector('[data-DD_visible="true"]');

        if (
            !openElement ||
            event.target === openElement ||
            openElement.contains(event.relatedTarget)
        )
            return;

        showInfo(openElement, 'false');
    });

    document.querySelectorAll('.dropDown').forEach((element, index) => {
        const btn = element.firstElementChild;
        btn.setAttribute('aria-controls', `DD_${index}`);
        element.querySelector('div').setAttribute('id', `DD_${index}`);

        showInfo(element, 'false');

        btn.addEventListener('click', (event) => {
            if (element.getAttribute('data-DD_visible') === 'true') {
                showInfo(element, 'false');
                return;
            }
            showInfo(
                document.querySelector('[data-DD_visible="true"]'),
                'false',
            );
            showInfo(element, 'true');
            event.stopPropagation();
        });
    });
}
dropdown();

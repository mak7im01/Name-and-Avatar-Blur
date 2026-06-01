(function () {
    'use strict';

    let currentBlurAll = true;

    // Читаем булево значение из объекта настроек (поддерживает формат {value, default} и plain-значение)
    function readBoolean(settings, key, fallback) {
        const entry = settings[key];
        if (entry !== null && typeof entry === 'object' && !Array.isArray(entry)) {
            if (typeof entry.value !== 'undefined') return Boolean(entry.value);
            if (typeof entry.default !== 'undefined') return Boolean(entry.default);
        }
        return typeof entry !== 'undefined' ? Boolean(entry) : fallback;
    }

    // Применение блюра ко всем целевым элементам
    function applyBlur() {
        const nameEl   = document.querySelector('.UserProfile_userName__PTRuJ');
        const avatarEl = document.querySelector('.UserID-Avatar-Image');

        if (nameEl) {
            if (currentBlurAll) {
                nameEl.style.setProperty('filter', 'blur(7px)', 'important');
            } else {
                nameEl.style.removeProperty('filter');
            }
        }

        if (avatarEl) {
            if (currentBlurAll) {
                avatarEl.style.setProperty('filter', 'blur(7px)', 'important');
                avatarEl.style.setProperty('clip-path', 'circle(50%)', 'important');
            } else {
                avatarEl.style.removeProperty('filter');
                avatarEl.style.removeProperty('clip-path');
            }
        }
    }

    // Применяем настройки из объекта и сразу перерисовываем
    function applySettings(settings) {
        currentBlurAll = readBoolean(settings, 'blurAll', true);
        applyBlur();
    }

    // Инициализация настроек — точно так же как в CoverDownloader, без ожидания
    const store = window.pulsesyncApi?.getSettings('Name and Avatar Blur') ?? {
        getCurrent: () => ({}),
        onChange: () => () => {},
    };

    applySettings(store.getCurrent());

    store.onChange(nextSettings => {
        applySettings(nextSettings);
    });

    // MutationObserver — следим за появлением целевых элементов в DOM
    const observer = new MutationObserver(() => {
        applyBlur();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();

// Текущее состояние настроек
let currentBlurAll = null;

// Применение блюра к элементам напрямую
function applyBlur() {
    const nameEl = document.querySelector('.UserProfile_userName__PTRuJ');
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

// Получение настроек из PulseSync
async function getSettings(name) {
    try {
        const response = await fetch(`http://localhost:2007/get_handle?name=${name}`);
        if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);

        const { data } = await response.json();
        if (!data?.sections) return null;

        const result = {};
        data.sections.forEach(section => {
            section.items.forEach(item => {
                result[item.id] = {
                    value: item.bool ?? item.input ?? item.selected ?? item.value ?? item.filePath,
                    default: item.defaultParameter
                };
            });
        });
        return result;
    } catch (e) {
        console.error("[NameAvatarBlur]", e);
        return null;
    }
}

// Обновляем настройки каждые 2 секунды
async function updateSettings() {
    const settings = await getSettings("Name and Avatar Blur");
    if (!settings) return;

    const blurAll = settings?.blurAll?.value ?? true;
    if (blurAll !== currentBlurAll) {
        currentBlurAll = blurAll;
    }
}

// Применяем блюр каждые 100мс — мгновенно для глаза, без конфликтов с другими аддонами
function applyLoop() {
    applyBlur();
    requestAnimationFrame(applyLoop);
}

updateSettings();
setInterval(updateSettings, 2000);
requestAnimationFrame(applyLoop);

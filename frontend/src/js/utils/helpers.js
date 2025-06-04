export function clearResults() {
    const words = document.getElementById("result-words");
    const sentences = document.getElementById("result-sentences");
    const index = document.getElementById("result-indexR");
    const topicContainer = document.getElementById("result-topics");

    words.textContent = '';
    sentences.textContent = '';
    index.textContent = '';
    topicContainer.innerHTML = '';
}

export async function copyToClipboard(textarea) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(textarea.value);
        } catch (err) {
            fallbackCopy(textarea);
        }
    } else {
        fallbackCopy(textarea);
    }
}

function fallbackCopy(textarea) {
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Ошибка при копировании', err);
    }
    textarea.blur();
}
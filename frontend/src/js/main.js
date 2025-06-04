import sendData from './api/script.js';
import { clearResults, copyToClipboard } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('textInput');
    const fileInput = document.getElementById('fileInput');
    const selectFile = document.getElementById('selectFile');

    const startBtn = document.getElementById('startBtn');
    const newBtn = document.getElementById('newBtn');
    const newBtn2 = document.getElementById('newBtn2');
    const copyBtn = document.getElementById('copyBtn');

    const errorMessage = document.getElementById('error-message');
    const uploader = document.getElementById('uploader');
    const dndArea = document.getElementById('dndArea');
    const textUploadFile = document.getElementById('textUploadFile');

    let errorTimeout;

    function showError(message) {
        const errorContainer = errorMessage.parentElement;
        errorMessage.textContent = message;

        if (errorTimeout) clearTimeout(errorTimeout);

        errorContainer.classList.remove('active');

        void errorContainer.offsetWidth;

        errorContainer.classList.add('active');

        errorTimeout = setTimeout(() => {
            errorContainer.classList.remove('active');
        }, 9000);
    }

    function toggleState() {
        uploader.classList.toggle('results');
        textarea.readOnly = !textarea.readOnly;
        selectFile.style.display = textarea.value.length > 0 ? 'none' : 'flex';
    }

    function loadFile(file) {
        const reader = new FileReader();
        reader.onload = function () {
            const text = reader.result;
            textarea.value = text;
            return text;
        };
        reader.readAsText(file);
    }

    async function handleFile(file) {
        if (!file) return;

        if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
            showError('Неверный формат файла!');
            return;
        }

        const maxSize = 1 * 1024 * 1024;
        if (file.size > maxSize) {
            showError('Максимальный размер 1мб');
            return;
        }

        textarea.value = ' '
        uploader.classList.add('loadingFile');
        startBtn.classList.add('loading');

        try {
            await sendData(file, showError);
            startBtn.classList.remove('loading');
            uploader.classList.remove('loadingFile');
            textarea.value = await loadFile(file);
            toggleState();
        } catch (err) {
            if (err) {
                showError(err.message);
            }
            startBtn.classList.remove('loading');
            uploader.classList.remove('loadingFile');
        }
    }

    dndArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (uploader.classList.contains('results')) return

        uploader.classList.add('drag-over');
        textarea.value = ' '
    });

    dndArea.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    dndArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (uploader.classList.contains('results')) return

        uploader.classList.remove('drag-over');
        textarea.value = ''
    });

    dndArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (uploader.classList.contains('results')) return

        uploader.classList.remove('drag-over');
        selectFile.style.display = 'flex'
        textUploadFile.style.display = 'none'

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;

            handleFile(file);
        }
    });

    textarea.addEventListener('input', () => {
        selectFile.style.display = textarea.value.length > 0 ? 'none' : 'flex';
    })

    selectFile.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        await handleFile(file);
    });

    startBtn.addEventListener('click', async () => {
        const textValue = textarea.value.trim();
        if (!textValue) {
            showError('Добавьте текст для анализа');
            return;
        }

        startBtn.classList.add('loading');

        try {
            await sendData(null, showError);
            startBtn.classList.remove('loading');
            toggleState();
        } catch (err) {
            showError('Ошибка сервера: ' + err.message);
            startBtn.classList.remove('loading');
        }
    })

    newBtn2.addEventListener('click', () => {
        textarea.value = '';
        fileInput.value = '';
        clearResults();
        toggleState();
    })

    copyBtn.addEventListener('click', async () => {
        await copyToClipboard(textarea);
    });
})
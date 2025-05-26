document.addEventListener('DOMContentLoaded', () => {
    initSearch();

    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    // Load saved theme preference
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    darkModeToggle.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});

/**
 * Utility function to validate URLs using regex and input type="url"
 * @param {string} url 
 * @returns {boolean}
 */
function isValidURL(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (e) {
        return false;
    }
}

/**
 * Heuristic risk scoring based on suspicious keywords and risky domains
 * @param {string} url 
 * @returns {{score: number, level: string, message: string}}
 */
function getRiskScore(url) {
    const suspiciousKeywords = ['pix', 'banco', 'verificacao', 'seguranca', 'alerta', 'urgente'];
    const riskyDomains = ['.tk', '.xyz', '.ml', '.cf', '.gq'];

    let score = 0;
    let message = 'Baixo risco detectado.';
    let level = 'Baixo Risco';

    const lowerUrl = url.toLowerCase();

    suspiciousKeywords.forEach(keyword => {
        if (lowerUrl.includes(keyword)) {
            score += 20;
        }
    });

    riskyDomains.forEach(domain => {
        if (lowerUrl.endsWith(domain)) {
            score += 40;
        }
    });

    if (score >= 60) {
        level = 'Alto Risco';
        message = 'Alto risco detectado! Cuidado com este site.';
    } else if (score >= 30) {
        level = 'Médio Risco';
        message = 'Risco moderado detectado. Verifique com atenção.';
    }

    return { score, level, message };
}

/**
 * Save search history to localStorage
 * @param {string} url 
 * @param {string} level 
 */
function saveSearchHistory(url, level) {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const timestamp = new Date().toISOString();
    history.unshift({ url, level, timestamp });
    if (history.length > 10) history.pop(); // keep max 10 entries
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

/**
 * Load search history from localStorage and render in UI
 */
function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const container = document.getElementById('searchHistoryContainer');
    if (!container) return;

    container.innerHTML = '';

    history.forEach(entry => {
        const date = new Date(entry.timestamp);
        const formattedDate = date.toLocaleString('pt-BR');

        let colorClass = 'bg-green-100 text-green-800';
        let iconClass = 'fas fa-check-circle';
        if (entry.level === 'Alto Risco') {
            colorClass = 'bg-red-100 text-red-800';
            iconClass = 'fas fa-exclamation-triangle';
        } else if (entry.level === 'Médio Risco') {
            colorClass = 'bg-yellow-100 text-yellow-800';
            iconClass = 'fas fa-exclamation-circle';
        }

        const card = document.createElement('div');
        card.className = `p-4 rounded mb-3 border ${colorClass} flex items-center justify-between shadow-sm`;

        card.innerHTML = `
            <div>
                <i class="${iconClass} mr-2"></i>
                <a href="${entry.url}" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-700">${entry.url}</a>
            </div>
            <div class="text-sm text-gray-600">${formattedDate}</div>
            <div class="font-semibold">${entry.level}</div>
        `;

        container.appendChild(card);
    });
}

/**
 * Initialize search functionality with validation, risk scoring, and history
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearSearchButton = document.getElementById('clearSearchButton');

    const handleSearch = (e) => {
        e.preventDefault();
        const url = searchInput.value.trim();

        if (!url) {
            showNotification('Por favor, digite uma URL para análise.', 'error');
            return;
        }

        if (!isValidURL(url)) {
            showNotification('URL inválida. Por favor, insira uma URL válida.', 'error');
            return;
        }

        searchButton.disabled = true;
        const originalButtonText = searchButton.innerHTML;
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analisando...';

        setTimeout(() => {
            const { score, level, message } = getRiskScore(url);

            displaySearchResults({ name: url, riskLevel: level, riskScore: score, message });
            showNotification('Análise concluída!', 'success');
            saveSearchHistory(url, level);
            loadSearchHistory();

            searchButton.disabled = false;
            searchButton.innerHTML = originalButtonText;
        }, 1500);
    };

    const handleClearSearch = () => {
        searchInput.value = '';
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
        searchInput.focus();
    };

    searchButton.addEventListener('click', handleSearch);
    clearSearchButton.addEventListener('click', handleClearSearch);

    loadSearchHistory();
}

/**
 * Display search results in a styled card
 * @param {object} result 
 */
function displaySearchResults(result) {
    const getRiskColorClass = (riskLevel) => {
        if (riskLevel === 'Alto Risco') return 'bg-red-50 border-red-200 text-red-700';
        if (riskLevel === 'Médio Risco') return 'bg-yellow-50 border-yellow-200 text-yellow-700';
        return 'bg-green-50 border-green-200 text-green-700';
    };

    const resultHTML = `
        <div class="mt-6 p-6 rounded-lg border ${getRiskColorClass(result.riskLevel)} animate-fadeIn">
            <div class="flex justify-between items-start mb-4">
                <h3 class="font-semibold text-lg break-words">${result.name}</h3>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${
                    result.riskLevel === 'Alto Risco' ? 'bg-red-100 text-red-800' :
                    result.riskLevel === 'Médio Risco' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }">${result.riskLevel}</span>
            </div>
            <p class="mb-2">${result.message}</p>
            <div class="flex items-center space-x-4">
                <div class="flex items-center">
                    <i class="fas fa-chart-line mr-2"></i>
                    <span class="font-medium">Pontuação de Risco:</span>
                    <span class="ml-1 font-semibold">${result.riskScore}%</span>
                </div>
            </div>
        </div>
    `;

    let resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results';
        const searchSection = document.getElementById('search');
        if (searchSection) {
            searchSection.querySelector('.bg-white').appendChild(resultsContainer);
        }
    }

    resultsContainer.innerHTML = resultHTML;
}

/**
 * Show notification messages
 * @param {string} message 
 * @param {string} type 'success' or 'error'
 */
function showNotification(message, type = 'success') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white max-w-md z-50 animate-fadeIn flex items-center`;

    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transition = 'opacity 0.3s ease-in-out';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
</create_file>

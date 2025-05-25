document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initReportForm();
    initStatisticsCounter();
    initSmoothScroll();
});

function initSearch() {
    const searchForm = document.querySelector('#search .flex');
    if (!searchForm) return;

    const searchInput = searchForm.querySelector('input');
    const searchButton = searchForm.querySelector('button');
    
    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            showNotification('Por favor, digite o nome da empresa ou CNPJ', 'error');
            return;
        }

        searchButton.disabled = true;
        const originalButtonText = searchButton.innerHTML;
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Buscando...';
        
        setTimeout(() => {
            try {
                const riskScore = Math.floor(Math.random() * 100);
                const complaints = Math.floor(Math.random() * 1000);
                
                const mockResult = {
                    name: searchTerm,
                    riskLevel: riskScore,
                    complaints: complaints,
                    lastUpdate: new Date().toLocaleDateString('pt-BR'),
                    riskCategory: riskScore > 70 ? 'Alto Risco' : riskScore > 30 ? 'Médio Risco' : 'Baixo Risco'
                };
                
                displaySearchResults(mockResult);
                showNotification('Busca realizada com sucesso!', 'success');
            } catch (error) {
                showNotification('Erro ao realizar a busca. Tente novamente.', 'error');
            } finally {
                searchButton.disabled = false;
                searchButton.innerHTML = originalButtonText;
            }
        }, 1500);
    };

    searchButton.addEventListener('click', handleSearch);
    searchForm.addEventListener('submit', handleSearch);
}

function displaySearchResults(result) {
    const getRiskColorClass = (riskLevel) => {
        if (riskLevel > 70) return 'bg-red-50 border-red-200 text-red-700';
        if (riskLevel > 30) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
        return 'bg-green-50 border-green-200 text-green-700';
    };

    const resultHTML = `
        <div class="mt-6 p-6 rounded-lg border ${getRiskColorClass(result.riskLevel)} animate-fadeIn">
            <div class="flex justify-between items-start mb-4">
                <h3 class="font-semibold text-lg">${result.name}</h3>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${
                    result.riskLevel > 70 ? 'bg-red-100 text-red-800' :
                    result.riskLevel > 30 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }">${result.riskCategory}</span>
            </div>
            <div class="space-y-3">
                <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="h-2.5 rounded-full ${
                            result.riskLevel > 70 ? 'bg-red-600' :
                            result.riskLevel > 30 ? 'bg-yellow-400' :
                            'bg-green-500'
                        }" style="width: ${result.riskLevel}%"></div>
                    </div>
                    <span class="ml-3 font-medium">${result.riskLevel}%</span>
                </div>
                <p class="flex items-center">
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    <span class="font-medium">Reclamações:</span>
                    <span class="ml-2">${result.complaints}</span>
                </p>
                <p class="flex items-center">
                    <i class="fas fa-clock mr-2"></i>
                    <span class="font-medium">Última Atualização:</span>
                    <span class="ml-2">${result.lastUpdate}</span>
                </p>
            </div>
        </div>
    `;
    
    let resultsContainer = document.querySelector('#search-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results';
        document.querySelector('#search .bg-white').appendChild(resultsContainer);
    }
    
    resultsContainer.innerHTML = resultHTML;
}

function initReportForm() {
    const form = document.querySelector('#reportForm');
    if (!form) return;

    const typeSelect = form.querySelector('select[name="scamType"]');
    const description = form.querySelector('textarea[name="description"]');
    const contacts = form.querySelector('input[name="contacts"]');
    const submitButton = form.querySelector('button[type="submit"]');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate scam type
        if (!typeSelect.value) {
            showNotification('Por favor, selecione o tipo de golpe', 'error');
            typeSelect.focus();
            return;
        }

        // Validate description
        if (!description.value.trim()) {
            showNotification('Por favor, descreva o golpe', 'error');
            description.focus();
            return;
        }

        // Prepare form data
        const formData = {
            type: typeSelect.value,
            description: description.value.trim(),
            contacts: contacts.value.trim()
        };

        // Show loading state
        submitButton.disabled = true;
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';

        // Simulate form submission
        setTimeout(() => {
            try {
                console.log('Dados da denúncia:', formData);
                showNotification('Denúncia enviada com sucesso! Obrigado por contribuir.', 'success');
                form.reset();
                typeSelect.selectedIndex = 0;

                // Scroll to top after successful submission
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } catch (error) {
                showNotification('Erro ao enviar denúncia. Tente novamente.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        }, 1500);
    });

    // Add change event listener to select for styling
    if (typeSelect) {
        typeSelect.addEventListener('change', function() {
            if (this.value) {
                this.classList.add('text-gray-900');
                this.classList.remove('text-gray-500');
            } else {
                this.classList.remove('text-gray-900');
                this.classList.add('text-gray-500');
            }
        });
    }
}

function initStatisticsCounter() {
    const statsContainer = document.querySelector('#dashboard');
    if (!statsContainer) return;

    const stats = statsContainer.querySelectorAll('.text-gray-700');
    if (!stats.length) return;
    
    const animateValue = (element, start, end, duration) => {
        if (!element || !element.textContent) return;
        
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const updateValue = () => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
            }
            
            const textParts = element.textContent.split(/(\d+)/);
            if (textParts.length >= 3) {
                element.textContent = textParts[0] + Math.floor(current) + textParts[2];
            }
            
            if (current !== end) {
                requestAnimationFrame(updateValue);
            }
        };
        
        requestAnimationFrame(updateValue);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const match = element.textContent.match(/\d+/);
                if (match) {
                    const number = parseInt(match[0]);
                    animateValue(element, 0, number, 2000);
                }
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

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

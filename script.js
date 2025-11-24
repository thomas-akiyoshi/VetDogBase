// Aguarda o conteúdo do DOM ser totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const showAllBtn = document.getElementById('showAllBtn');
    const cardsContainer = document.getElementById('cards-container');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const imageGallery = document.querySelector('.image-gallery');

    let dogData = []; // Array para armazenar os dados dos cachorros

    // 1. Carrega os dados do data.json
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            dogData = data;
            renderGallery(dogData); // Renderiza a galeria de imagens
        })
        .catch(error => console.error('Erro ao carregar o arquivo data.json:', error));

    // Função para renderizar a galeria de imagens
    const renderGallery = (dogs) => {
        imageGallery.innerHTML = '';
        dogs.forEach(dog => {
            // Cria um container para a imagem e o título
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.breed = dog.nome; // Adiciona o data attribute ao container

            const img = document.createElement('img');
            img.src = `assets/img/${dog.imagem}`;
            img.alt = `Cachorro da raça ${dog.nome}`;
            
            // Cria o elemento do título
            const title = document.createElement('div');
            title.className = 'gallery-title';
            title.textContent = dog.nome;

            // Adiciona a imagem e o título ao container
            galleryItem.appendChild(img);
            galleryItem.appendChild(title);

            // Adiciona o item da galeria ao container principal
            imageGallery.appendChild(galleryItem);
        });
    };

    // 2. Função para renderizar os cards completos
    const renderCards = (dogs) => {
        cardsContainer.innerHTML = ''; // Limpa o container de cards
        suggestionsContainer.innerHTML = ''; // Limpa as sugestões

        if (dogs.length === 0) {
            cardsContainer.innerHTML = '<p>Nenhuma raça encontrada.</p>';
            return;
        }

        dogs.forEach(dog => {
            const card = document.createElement('div');
            card.className = 'card';
            card.id = `card-${dog.nome.replace(/\s+/g, '-')}`; // Adiciona um ID único

            card.innerHTML = `
                <img src="assets/img/${dog.imagem}" alt="Cachorro da raça ${dog.nome}" class="card-img">
                <h2>${dog.nome}</h2>
                <p><strong>Porte:</strong> ${dog.porte}</p>
                <p><strong>Temperamento:</strong> ${dog.temperamento}</p>
                <p><strong>Expectativa de Vida:</strong> ${dog.expectativa_de_vida}</p>
                <p>${dog.texto_informativo}</p>
                <a href="${dog.link}" class="card-cta" target="_blank">Mais Informações</a>
            `;
            cardsContainer.appendChild(card);
        });
    };

    // 3. Função para renderizar as sugestões de forma mais informativa
    const renderSuggestions = (dogs, searchTerm) => {
        suggestionsContainer.innerHTML = '';
        cardsContainer.innerHTML = '';

        dogs.forEach(dog => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';

            let displayText = dog.nome;
            const searchTermLower = searchTerm.toLowerCase();

            // Adiciona contexto à sugestão se a busca não for pelo nome
            if (dog.temperamento && dog.temperamento.toLowerCase().includes(searchTermLower) && !dog.nome.toLowerCase().includes(searchTermLower)) {
                // Encontra o temperamento específico que correspondeu
                const matchedTemp = dog.temperamento.split(',').find(t => t.trim().toLowerCase().includes(searchTermLower));
                if (matchedTemp) {
                    displayText += ` (${matchedTemp.trim()})`;
                }
            } else if (dog.porte && dog.porte.toLowerCase().includes(searchTermLower) && !dog.nome.toLowerCase().includes(searchTermLower)) {
                displayText += ` (${dog.porte})`;
            }

            suggestionItem.textContent = displayText;
            suggestionItem.addEventListener('click', () => {
                renderCards([dog]); // Renderiza o card completo do cão clicado
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
    };

    // 4. Event listener para o campo de busca
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();

        if (searchTerm.length > 1) { // Aumentado para 2 caracteres para evitar muitos resultados
            const filteredDogs = dogData.filter(dog => {
                const nomeMatch = dog.nome.toLowerCase().includes(searchTerm);
                const porteMatch = dog.porte.toLowerCase().includes(searchTerm);
                const temperamentoMatch = dog.temperamento.toLowerCase().includes(searchTerm);
                return nomeMatch || porteMatch || temperamentoMatch;
            });
            renderSuggestions(filteredDogs, searchTerm);
        } else {
            // Se o campo de busca estiver vazio ou muito curto, limpa ambos os containers
            suggestionsContainer.innerHTML = '';
            cardsContainer.innerHTML = '';
        }
    });

    // 5. Event listener para o botão "Mostrar Todos"
    showAllBtn.addEventListener('click', () => {
        renderCards(dogData); // Renderiza todos os cards
    });

    // 6. Event listener para a galeria de imagens
    imageGallery.addEventListener('click', (event) => {
        const galleryItem = event.target.closest('.gallery-item'); // Encontra o item de galeria mais próximo
        if (galleryItem) {
            const breedName = galleryItem.dataset.breed;
            const dog = dogData.find(d => d.nome === breedName);
            if (dog) {
                // Verifica se o card já está na tela
                const cardId = `card-${dog.nome.replace(/\s+/g, '-')}`;
                let card = document.getElementById(cardId);

                // Se o card não existir, renderiza apenas ele
                if (!card) {
                    renderCards([dog]);
                    card = document.getElementById(cardId); // Pega o card recém-criado
                }
                
                // Rola para o card
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    });

    // Inicializa o Swiper
    const mainSwiper = new Swiper('.main-swiper', {
        // Opções do Swiper
        direction: 'horizontal',
        loop: true,

        // Paginação
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        // Autoplay
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
});

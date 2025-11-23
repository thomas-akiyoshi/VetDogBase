
let cardContainer = document.querySelector(".card-container");
let dados = [];
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("botao-busca");

async function carregarBase() {
  try {
    const resposta = await fetch("./data/baseDeConhecimento.json");
    const dados = await resposta.json();

    console.log("Base carregada:", dados);

    // Aqui você insere os dados no HTML
    exibirItens(dados);

  } catch (err) {
    console.error("Erro ao carregar base:", err);
  }
}

function exibirItens(lista) {
  const container = document.getElementById("lista-itens");
  container.innerHTML = "";

  lista.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <h3>${item.nome}</h3>
      <p>${item.descricao}</p>
    `;
    container.appendChild(div);
  });
}

carregarBase();

// Adiciona um event listener para quando o DOM estiver completamente carregado.
document.addEventListener("DOMContentLoaded", () => {
    carregarDados();

    // Verifica se o elemento de busca existe antes de adicionar o listener.
    if (searchButton) {
        searchButton.addEventListener("click", () => buscar());
    }
    
    if (searchInput) {
        searchInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                buscar();
            }
        });
    }
});

async function carregarDados() {
    let resposta = await fetch("data.json");
    dados = await resposta.json();
}

function buscar() {
    const termoDeBusca = searchInput.value.toLowerCase().trim();
    if (termoDeBusca.length === 0) {
        cardContainer.innerHTML = ""; // Limpa os cards se a busca estiver vazia
        return;
    }
    const dadosFiltrados = dados.filter(dado =>
        dado.nome.toLowerCase().includes(termoDeBusca) ||
        dado.porte.toLowerCase().includes(termoDeBusca) ||
        dado.Temperamento.toLowerCase().includes(termoDeBusca)
    );
    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa o container antes de renderizar os novos cards
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `<h2>${dado.nome}</h2>
        <p><strong>Porte:</strong> ${dado.porte}</p>
        <p><strong>Personalidade:</strong> ${dado.Temperamento}</p>
        <p><strong>Expectativa de vida:</strong> ${dado["Expectativa de Vida"]}</p>
        <a href="${dado.link}" target="_blank">Saiba mais</a>`;

        cardContainer.appendChild(article);
    }
}
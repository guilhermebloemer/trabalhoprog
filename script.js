const cafes = [
  { id: 1, nome: "Bourbon Amarelo", origem: "Minas Gerais" },
  { id: 2, nome: "Catuaí Vermelho", origem: "Paraná" },
  { id: 3, nome: "Arara", origem: "Espírito Santo" },
  { id: 4, nome: "Mundo Novo", origem: "Bahia" }
];

function lerAvaliacoes() {
  const dados = localStorage.getItem("avaliacoes");
  return dados ? JSON.parse(dados) : [];
}

function salvarAvaliacao(avaliacao) {
  const avaliacoes = lerAvaliacoes();
  avaliacoes.push(avaliacao);
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
}

function calcularRanking() {
  const avaliacoes = lerAvaliacoes();

  return cafes
    .map(cafe => {
      const notas = avaliacoes.filter(avaliacao => avaliacao.cafeId === cafe.id);

      if (notas.length === 0) {
        return { ...cafe, media: null };
      }

      const soma = notas.reduce((total, avaliacao) => total + avaliacao.media, 0);

      return { ...cafe, media: soma / notas.length };
    })
    .filter(cafe => cafe.media !== null)
    .sort((a, b) => b.media - a.media);
}

const listaCartoes = document.getElementById("lista-cartoes");
if (listaCartoes) {
  cafes.forEach(cafe => {
    const cartao = document.createElement("article");
    cartao.className = "cartao";
    cartao.innerHTML = `
      <h2>${cafe.nome}</h2>
      <p>${cafe.origem}</p>
      <a href="avaliar.html" class="botao">Avaliar</a>
    `;
    listaCartoes.appendChild(cartao);
  });
}

const formulario = document.getElementById("formulario-avaliacao");
if (formulario) {
  const select = document.getElementById("cafe");

  cafes.forEach(cafe => {
    const opcao = document.createElement("option");
    opcao.value = cafe.id;
    opcao.textContent = cafe.nome;
    select.appendChild(opcao);
  });

  const mensagem = document.getElementById("mensagem-avaliacao");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const cafeId = Number(document.getElementById("cafe").value);
    const aroma = Number(document.getElementById("aroma").value);
    const docura = Number(document.getElementById("docura").value);
    const acidez = Number(document.getElementById("acidez").value);
    const corpo = Number(document.getElementById("corpo").value);
    const finalizacao = Number(document.getElementById("finalizacao").value);

    const media = (aroma + docura + acidez + corpo + finalizacao) / 5;

    salvarAvaliacao({ cafeId, media });

    const cafeAvaliado = cafes.find(cafe => cafe.id === cafeId);

    mensagem.textContent = `Avaliação de "${cafeAvaliado.nome}" salva. Média: ${media.toFixed(1)}`;

    if (media >= 8) {
      mensagem.textContent += " - Excelente Café";
    }

    mensagem.classList.remove("escondido");
    formulario.reset();
  });
}

const listaRanking = document.getElementById("lista-ranking");
if (listaRanking) {
  const vazio = document.getElementById("ranking-vazio");
  const ranking = calcularRanking();

  if (ranking.length === 0) {
    vazio.classList.remove("escondido");
  } else {
    ranking.forEach((cafe, indice) => {
      const item = document.createElement("li");
      item.className = "item-ranking" + (indice === 0 ? " primeiro" : "");

      item.innerHTML = `
        <span>${indice + 1}º</span>
        <span>${cafe.nome}</span>
        <span>${cafe.media.toFixed(1)}</span>
      `;

      listaRanking.appendChild(item);
    });
  }
}
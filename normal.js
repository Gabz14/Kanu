function embaralhar(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const midiasEmbaralhadas = embaralhar(midias);

function renderizarCards() {
    const grid = document.getElementById("gridMidia");

    midiasEmbaralhadas.forEach(midia => {
        const card = document.createElement("div");
        card.classList.add("card-midia");
        card.dataset.id = midia.id;

        if (midia.tipo === "foto") {
            card.innerHTML = `<img src="${midia.src}" alt="midia ${midia.id}">`;
        } else {
            if (midia.thumb) {
                card.innerHTML = `<img src="${midia.thumb}" alt="midia ${midia.id}">`;
            } else {
                card.innerHTML = `<video src="${midia.src}#t=0.1" preload="metadata" muted playsinline></video>`;
            }
        }

        grid.appendChild(card);
    });
}
function renderizarSlots() {
    const grid = document.getElementById("gridSlots");
    for (let i = 1; i <= midias.length; i++) {
        const slot = document.createElement("div");
        slot.classList.add("slot");
        slot.dataset.posicao = i;
        slot.innerHTML = `
            <span class="numero-slot">${i}</span>
            <div class="slot-midia" data-posicao="${i}">
                <span class="slot-vazio">+</span>
            </div>
            <div class="slot-data">
                <select class="select-mes">
                    <option value="">Mês</option>
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4">Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                </select>
                <select class="select-dia">
                    <option value="">Dia</option>
                </select>
            </div>
        `;
        grid.appendChild(slot);
    }
}

function abrirModal(conteudo) {
    const modal = document.getElementById("modal");
    const modalConteudo = document.getElementById("modalConteudo");
    modalConteudo.innerHTML = conteudo;
    const video = modalConteudo.querySelector("video");
    if (video) {
        video.controls = true;
        video.play();
    }
    modal.classList.remove("escondido");
}

let cardSelecionado = null;
let cliqueTimer = null;

document.getElementById("gridMidia").addEventListener("click", function (e) {
    const card = e.target.closest(".card-midia");
    if (!card) return;

    cliqueTimer = setTimeout(() => {
        if (cardSelecionado) cardSelecionado.classList.remove("selecionado");
        if (cardSelecionado === card) {
            cardSelecionado = null;
            return;
        }
        cardSelecionado = card;
        card.classList.add("selecionado");
    }, 250);
});

document.getElementById("gridMidia").addEventListener("dblclick", function (e) {
    const card = e.target.closest(".card-midia");
    if (!card) return;

    clearTimeout(cliqueTimer);
    abrirModal(card.innerHTML);
});

document.getElementById("modal").addEventListener("click", function (e) {
    if (e.target === this) {
        const video = document.querySelector("#modalConteudo video");
        if (video) video.pause();
        this.classList.add("escondido");
    }
});

function criarCardMidia(idMidia, conteudoHTML) {
    const card = document.createElement("div");
    card.classList.add("card-midia");
    card.dataset.id = idMidia;
    card.innerHTML = conteudoHTML;
    return card;
}

document.getElementById("gridSlots").addEventListener("click", function (e) {
    const slotMidia = e.target.closest(".slot-midia");
    if (!slotMidia) return;

    const gridMidia = document.getElementById("gridMidia");

    const slotTemMidia = slotMidia.dataset.idMidia;

    if (!cardSelecionado && slotTemMidia) {
        const cardDevolvido = criarCardMidia(slotMidia.dataset.idMidia, slotMidia.innerHTML);

        gridMidia.appendChild(cardDevolvido);

        slotMidia.innerHTML = `<span class="slot-vazio">+</span>`;
        delete slotMidia.dataset.idMidia;

        slotMidia.classList.remove("dica-certo", "dica-errado");
        return;
    }

    if (!cardSelecionado) return;

    if (slotTemMidia) {
        const cardAntigo = criarCardMidia(slotMidia.dataset.idMidia, slotMidia.innerHTML);
        gridMidia.appendChild(cardAntigo);
    }

    slotMidia.innerHTML = cardSelecionado.innerHTML;
    slotMidia.dataset.idMidia = cardSelecionado.dataset.id;
    slotMidia.classList.remove("dica-certo", "dica-errado");

    cardSelecionado.remove();
    cardSelecionado = null;
});

document.getElementById("gridSlots").addEventListener("change", function (e) {
    if (!e.target.classList.contains("select-mes")) return;
    const selectMes = e.target;
    const selectDia = selectMes.closest(".slot-data").querySelector(".select-dia");
    const mes = parseInt(selectMes.value);
    selectDia.innerHTML = `<option value="">Dia</option>`;
    if (!mes) return;
    const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const totalDias = diasPorMes[mes - 1];
    for (let d = 1; d <= totalDias; d++) {
        const option = document.createElement("option");
        option.value = d;
        option.textContent = d;
        selectDia.appendChild(option);
    }
});

let chances = 6;
let dicas = 3;

let inicioPartida = Date.now();

function atualizarContadores() {
    document.getElementById("contadorChances").textContent = `🎯 ${chances}/6`;
    document.getElementById("contadorDicas").textContent = `🔍 ${dicas}/3`;
}

function slotEstaCorreto(slot) {
    const posicao = parseInt(slot.dataset.posicao);

    const slotMidia = slot.querySelector(".slot-midia");
    const idMidia = parseInt(slotMidia.dataset.idMidia);

    const mesEscolhido = parseInt(slot.querySelector(".select-mes").value);
    const diaEscolhido = parseInt(slot.querySelector(".select-dia").value);

    const midia = midias.find(m => m.id === idMidia);

    return (
        midia &&
        midia.ordemCorreta === posicao &&
        midia.mes === mesEscolhido &&
        midia.dia === diaEscolhido
    );
}

function salvarRanking() {
    const perfil = JSON.parse(localStorage.getItem("perfilkanu"));
    const nome = perfil ? perfil.nome : prompt("Digite seu nome para o ranking:");

    if (!nome) return;

    const fimPartida = Date.now();
    const tempoEmSegundos = Math.floor((fimPartida - inicioPartida) / 1000);

    const pontuacao = (chances * 100) + (dicas * 50) - tempoEmSegundos;

    const novoResultado = {
        
        nome: nome,
        modo: "Normal",
        pontos: pontuacao,
        chancesRestantes: chances,
        dicasRestantes: dicas,
        tempo: tempoEmSegundos,
        data: new Date().toLocaleDateString("pt-BR")
    };

    const ranking = JSON.parse(localStorage.getItem("rankingkanu")) || [];

    ranking.push(novoResultado);

    ranking.sort((a, b) => b.pontos - a.pontos);

    const top10 = ranking.slice(0, 10);

    localStorage.setItem("rankingkanu", JSON.stringify(top10));
}

document.getElementById("btnVerificar").addEventListener("click", function () {
    const slots = document.querySelectorAll(".slot");
    let todosCorretos = true;
    let todosPreenchidos = true;

    slots.forEach(slot => {
        const slotMidia = slot.querySelector(".slot-midia");
        const idMidia = slotMidia.dataset.idMidia;

        const mesEscolhido = slot.querySelector(".select-mes").value;
        const diaEscolhido = slot.querySelector(".select-dia").value;

        if (!idMidia || !mesEscolhido || !diaEscolhido) {
            todosPreenchidos = false;
        }

        if (!slotEstaCorreto(slot)) {
            todosCorretos = false;
        }
    });

    if (!todosPreenchidos) {
        alert("Preencha todos os slots com mídia, mês e dia antes de verificar.");
        return;
    }

    if (todosCorretos) {
        salvarRanking();
        document.getElementById("telaVitoria").classList.remove("escondido");
    } else {
        chances--;
        atualizarContadores();

        if (chances === 0) {
            document.getElementById("btnVerificar").disabled = true;
            document.getElementById("btnDica").disabled = true;
            document.getElementById("telaDerrota").classList.remove("escondido");
        } else {
            alert(`Ainda tem algo errado! Chances restantes: ${chances}`);
        }
    }
});


document.getElementById("btnDica").addEventListener("click", function () {
    if (dicas === 0) return;

    const existeSlotPreenchido = [...document.querySelectorAll(".slot")].some(slot => {
        const slotMidia = slot.querySelector(".slot-midia");
        const idMidia = slotMidia.dataset.idMidia;
        const mesEscolhido = slot.querySelector(".select-mes").value;
        const diaEscolhido = slot.querySelector(".select-dia").value;

        return idMidia && mesEscolhido && diaEscolhido;

    });

    if (!existeSlotPreenchido) {
        alert("Preencha pelo menos um slot com mídia, mês e dia antes de usar uma dica");
        return;
    }

    dicas--;
    atualizarContadores();

    document.querySelectorAll(".slot").forEach(slot => {
        const slotMidia = slot.querySelector(".slot-midia");

        slotMidia.classList.remove("dica-certo", "dica-errado");

        const idMidia = slotMidia.dataset.idMidia;
        const mesEscolhido = slot.querySelector(".select-mes").value;
        const diaEscolhido = slot.querySelector(".select-dia").value;

        if (!idMidia  || !mesEscolhido || !diaEscolhido) {
            return;
        }
        
        if (slotEstaCorreto(slot)) {
            slotMidia.classList.add("dica-certo");

        } else {
            slotMidia.classList.add("dica-errado");
        }
    });
});



renderizarCards();
renderizarSlots();
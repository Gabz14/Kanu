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
                card.innerHTML = `<video src="${midia.src}" preload="metadata"></video>`;
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
let clicqueTimer = null;

document.getElementById("gridMidia").addEventListener("click", function (e) {
    const card = e.target.closest(".card-midia");
    if (!card) return;

    clicqueTimer = setTimeout(() => {
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

    clearTimeout(clicqueTimer);
    abrirModal(card.innerHTML);
});

document.getElementById("modal").addEventListener("click", function (e) {
    if (e.target === this) {
        const video = document.querySelector("#modalConteudo video");
        if (video) video.pause();
        this.classList.add("escondido");
    }
});

document.getElementById("gridSlots").addEventListener("click", function (e) {
    const slotMidia = e.target.closest(".slot-midia");
    if (!slotMidia) return;
    if (!cardSelecionado) return;
    slotMidia.innerHTML = cardSelecionado.innerHTML;
    slotMidia.dataset.idMidia = cardSelecionado.dataset.id;
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
})

let chances = 6;
let dicas = 3;

function atualizarContadores() {
    document.getElementById("contadorChances").textContent = `🎯 ${chances}/6`;
    document.getElementById("contadorDicas").textContent = `🔍 ${dicas}/3`;
}

document.getElementById("btnVerificar").addEventListener("click", function() {
    const slots = document.querySelectorAll(".slot");
    let todosCorretos = true;

    slots.forEach(slot => {
        const posicao = parseInt(slot.dataset.posicao);
        const slotMidia = slot.querySelector(".slot-midia");
        const idMidia = parseInt(slotMidia.dataset.idMidia);
        const midia = midias.find(m => m.id === idMidia);
        const posicaoCorreta = midia && midia.ordemCorreta === posicao;
        if (!posicaoCorreta) todosCorretos = false;
    });

    if (todosCorretos) {
        document.getElementById("telaVitoria").classList.remove("escondido");
    } else {
        chances--;
        atualizarContadores();
        if (chances === 0) {
            document.getElementById("btnVerificar").disabled = true;
            document.getElementById("btnDica").disabled = true;
            document.getElementById("telaDerrota").classList.remove("escondido");
        } else {
            alert(`❌ Ainda tem algo errado! Chances restantes: ${chances}`);
        }
    }
});


document.getElementById("btnDica").addEventListener("click", function() {

if (dicas === 0) return;

dicas--;
atualizarContadores();

document.querySelectorAll(".slot").forEach(slot => {
    const posicao = parseInt(slot.dataset.posicao);
    const slotMidia = slot.querySelector(".slot-midia");
    const idMidia = parseInt(slotMidia.dataset.idMidia);

    slotMidia.classList.remove("dica-certo", "dica-errado");

    if(!idMidia) return;

    const midia = midias.find(m => m.id === idMidia);
    const posicaoCorreta = midia && midia.ordemCorreta === posicao;

    if (posicaoCorreta) {
        slotMidia.classList.add("dica-certo");
    } else {
        slotMidia.classList.add("dica-errado");
    }
});
});

renderizarCards();
renderizarSlots();
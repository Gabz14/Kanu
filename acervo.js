const jogouUmaVez = localStorage.getItem("jogouUmaVez");

if (!jogouUmaVez) {
    document.getElementById("acervoBloqueado").classList.remove("escondido");
    document.getElementById("acervoConteudo").style.display = "none";
} else {
    renderizarAcervo();
}

function renderizarAcervo() {
    const midiasVistas = JSON.parse(localStorage.getItem("midiasVistas")) || [];
    const venceuNormal = localStorage.getItem("venceuNormal");

    const gridVideos = document.getElementById("acervoVideos");
    const gridFotos = document.getElementById("acervoFotos");

    // Filtra só as mídias que o usuário já viu
    const midiasDesbloqueadas = midias.filter(m => midiasVistas.includes(m.id));

    midiasDesbloqueadas.forEach(midia => {
        const item = document.createElement("div");
        item.classList.add("acervo-item");

        if (midia.tipo === "video") {
            item.innerHTML = `<video src="${midia.src}#t=0.1" preload="metadata" muted playsinline></video>`;
            gridVideos.appendChild(item);
        } else {
            item.innerHTML = `<img src="${midia.src}" alt="foto">`;
            gridFotos.appendChild(item);
        }

        // Abre modal ao clicar
        item.addEventListener("click", function() {
            abrirModalAcervo(midia);
        });
    });

    // Mensagem se não tiver nada ainda
    if (gridVideos.children.length === 0) {
        gridVideos.innerHTML = `<p class="acervo-vazio">Nenhum vídeo desbloqueado ainda. Jogue para desbloquear!</p>`;
    }
    if (gridFotos.children.length === 0) {
        gridFotos.innerHTML = `<p class="acervo-vazio">Nenhuma foto desbloqueada ainda. Jogue para desbloquear!</p>`;
    }

    // Áudios secretos
    if (venceuNormal) {
        document.getElementById("secreto1").classList.remove("bloqueado");
        document.getElementById("secreto1").innerHTML = `
            <span>🔊 Áudio Secreto 1</span>
            <audio controls src="assets/secretos/secreto1.mp3"></audio>
        `;
        document.getElementById("secreto2").classList.remove("bloqueado");
        document.getElementById("secreto2").innerHTML = `
            <span>🔊 Áudio Secreto 2</span>
            <audio controls src="assets/secretos/secreto2.mp3"></audio>
        `;
    }
}

function abrirModalAcervo(midia) {
    const modal = document.getElementById("modal");
    const modalConteudo = document.getElementById("modalConteudo");

    if (midia.tipo === "video") {
        modalConteudo.innerHTML = `<video src="${midia.src}" controls autoplay></video>`;
    } else {
        modalConteudo.innerHTML = `<img src="${midia.src}" alt="foto">`;
    }

    modal.classList.remove("escondido");
}
const listaRanking = document.getElementById("listaRanking");
const ranking = JSON.parse(localStorage.getItem("rankingkanu")) || [];

function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const restoSegundos = segundos % 60;

    if (minutos === 0) {
        return `${restoSegundos}s`;
    }
    return `${minutos}m ${restoSegundos}s`;

}

if (ranking.length === 0) {
    listaRanking.innerHTML = `<p>Nenhuma pontuação registrada ainda.</p>`;
} else {
    ranking.forEach((item, index) => {
        const linha = document.createElement("div");
        linha.classList.add("ranking-item");

        linha.innerHTML = `
        <span>#${index + 1}</span>
        <strong>${item.nome}</strong>
        <span>${item.pontos} pts</span>
        <span>${item.modo}</span>
        <span>${formatarTempo(item.tempo)}</span>
        <span>${item.data}</span>
        `;

        listaRanking.appendChild(linha);

    });
}

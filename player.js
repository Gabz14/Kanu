const playlist = [
    { titulo: "Explodir", src: "assets/musicas/explodir.mp3" },
    { titulo: "Entre Tapas e Beijos", src: "assets/musicas/entre-tapas-e-beijos.mp3" },
    { titulo: "A Mala é Falsa", src: "assets/musicas/a-mala-e-falsa.mp3" },
    { titulo: "Foi Assim", src: "assets/musicas/foi-assim.mp3" },
    { titulo: "Vícios e Virtudes", src: "assets/musicas/vicios-e-virtudes.m4a" },
    { titulo: "Eduardo e Mônica", src: "assets/musicas/eduardo-e-monica.m4a" },
    { titulo: "The First Time", src: "assets/musicas/the-first-time.mp3" },
    { titulo: "Turning Page", src: "assets/musicas/turning-page.mp3" },
    { titulo: "Simples Assim", src: "assets/musicas/simples-assim.mp3" },
];

let musicaAtual = 0;

const playerHTML = `
<div id="player" class="player">
    <div class="player-info">
        <span id="playerTitulo">Explodir</span>
    </div>
    <div class="player-controles">
        <button id="btnAnterior" class="btn-player">⏮</button>
        <button id="btnPlayPause" class="btn-player">▶</button>
        <button id="btnProximo" class="btn-player">⏭</button>
    </div>
    <audio id="audioPlayer"></audio>
</div>
`;

document.body.insertAdjacentHTML("beforeend", playerHTML);

const audio = document.getElementById("audioPlayer");
const titulo = document.getElementById("playerTitulo");
const btnPlay = document.getElementById("btnPlayPause");

function carregarMusica(index) {
    const musica = playlist[index];
    audio.src = musica.src;
    titulo.textContent = musica.titulo;
    btnPlay.textContent = "▶";
}

document.getElementById("btnPlayPause").addEventListener("click", function () {
    if (audio.paused) {
        audio.play();
        btnPlay.textContent = "⏸";
    } else {
        audio.pause();
        btnPlay.textContent = "▶";
    }
});

document.getElementById("btnProximo").addEventListener("click", function () {
    musicaAtual = (musicaAtual + 1) % playlist.length;
    carregarMusica(musicaAtual);
    audio.play();
    btnPlay.textContent = "⏸";
});

document.getElementById("btnAnterior").addEventListener("click", function () {
    musicaAtual = (musicaAtual - 1 + playlist.length) % playlist.length;
    carregarMusica(musicaAtual);
    audio.play();
    btnPlay.textContent = "⏸";
});

audio.addEventListener("ended", function () {
    musicaAtual = (musicaAtual + 1) % playlist.length;
    carregarMusica(musicaAtual);
    audio.play();
});

carregarMusica(0);
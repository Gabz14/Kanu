function atualizarTempo() {
    let inicio = new Date("2025-09-11");
    let agora = new Date();

    let diff = agora - inicio;
    let segundos = Math.floor(diff / 1000);
    let minutos = Math.floor(segundos / 60);
    let horas = Math.floor(minutos / 60);
    let dias = Math.floor(horas / 24);

    segundos = segundos % 60;
    minutos = minutos % 60;
    horas = horas % 24;

    document.getElementById("tempo").innerText = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}

atualizarTempo();
setInterval(atualizarTempo, 1000);

let palavras = [];

function iniciar() {
    const spans = document.querySelectorAll(".palavras span");
    const total = spans.length;

    spans.forEach((el, index) => {
        const colunas = 4;
        const linhas = Math.ceil(total / colunas);
        const col = index % colunas;
        const lin = Math.floor(index / colunas);

        const larguraZona = window.innerWidth / colunas;
        const alturaZona = window.innerHeight / linhas;

        const x = col * larguraZona + Math.random() * (larguraZona * 0.6);
        const y = lin * alturaZona + Math.random() * (alturaZona * 0.6);

        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.opacity = "0";
        setTimeout(() => {
            el.style.transition = "opacity 1.5s ease";
            el.style.opacity = "0.6";
        }, index * 200);

        palavras.push({
            el,
            x,
            y,
            vx: x < window.innerWidth / 2 ? Math.random() * 0.3 + 0.1 : -(Math.random() * 0.3 + 0.1),
            vy: y < window.innerHeight / 2 ? Math.random() * 0.3 + 0.1 : -(Math.random() * 0.3 + 0.1),
        });
    });

    animar();
}

function animar() {
    let card = document.querySelector("#card2");
    let c = card.getBoundingClientRect();

    palavras.forEach(p => {

        p.x += p.vx;
        p.y += p.vy;

        // rebater nas bordas
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;

        // detectar card
        let r = p.el.getBoundingClientRect();

        let dentro =
            !(r.right < c.left ||
                r.left > c.right ||
                r.bottom < c.top ||
                r.top > c.bottom);

        if (dentro) {
            p.el.style.opacity = "0";
            p.el.style.filter = "blur(10px)";
        } else {
            p.el.style.opacity = "0.6";
            p.el.style.filter = "blur(0px)";
        }
    });

    requestAnimationFrame(animar);
}

iniciar();
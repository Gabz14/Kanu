const headerFotoPerfil = document.getElementById("headerFotoPerfil");
const headerNomePerfil = document.getElementById("headerNomePerfil");

const perfilHeader = JSON.parse(localStorage.getItem("perfilkanu"));

if (perfilHeader) {
    if (headerNomePerfil) {
        headerNomePerfil.textContent = perfilHeader.nome;
    }

    if (headerFotoPerfil && perfilHeader.foto) {
        headerFotoPerfil.src = perfilHeader.foto;
    }
}
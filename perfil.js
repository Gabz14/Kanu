const headerFotoPerfil = document.getElementById("headerFotoPerfil");
const headerNomePerfil = document.getElementById("headerNomePerfil");
const inputNome = document.getElementById("inputNome");
const inputFoto = document.getElementById("inputFoto");
const previewNome = document.getElementById("previewNome");
const previewFoto = document.getElementById("previewFoto");
const btnSalvarPerfil = document.getElementById("btnSalvarPerfil");

let fotoSelecionada = null;

const perfilSalvo = JSON.parse(localStorage.getItem("perfilkanu"));

if (perfilSalvo) {
    inputNome.value = perfilSalvo.nome;
    previewNome.textContent = perfilSalvo.nome;

    if (headerNomePerfil) {
        headerNomePerfil.textContent = perfilSalvo.nome;
    }

    if (perfilSalvo.foto) {
        previewFoto.src = perfilSalvo.foto;

        if (headerFotoPerfil) {
            headerFotoPerfil.src = perfilSalvo.foto;
        }
    }
}

inputNome.addEventListener("input", function () {
    previewNome.textContent = inputNome.value || "Jogador";
});

inputFoto.addEventListener("change", function () {
    const arquivo = inputFoto.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function () {
        fotoSelecionada = leitor.result;
        previewFoto.src = fotoSelecionada;
    };

    leitor.readAsDataURL(arquivo);
});

btnSalvarPerfil.addEventListener("click", function () {
    const perfil = {
        nome: inputNome.value || "Jogador",
        foto: fotoSelecionada || previewFoto.src,
        conquistas: []
    };

    localStorage.setItem("perfilkanu", JSON.stringify(perfil));

if (headerNomePerfil) {
    headerNomePerfil.textContent = perfil.nome;
}

if (headerFotoPerfil) {
    headerFotoPerfil.src = perfil.foto;
}

    alert("Perfil salvo com sucesso!");
});
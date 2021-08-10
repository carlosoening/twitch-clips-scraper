const url = document.getElementById("urlInput");
const botaoGerar = document.getElementById("gerar");

function getVideoFromUrl(event) {
    event.preventDefault();
    botaoGerar.disabled = true;
    const urlText = url.value;
    if (!urlText) {
        return;
    }
    fetch(`/twitch/scrap?url=${urlText}`)
    .then(res => res.text())
    .then(clipUrl => {
        generateDownload(clipUrl);
        botaoGerar.disabled = false;
    });
}

function generateDownload(url) {
    let dwldLink = document.createElement("a");
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  // Se Safari, abre em nova janela para salvar o arquivo com nome aleatório.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}

botaoGerar.onclick = getVideoFromUrl;
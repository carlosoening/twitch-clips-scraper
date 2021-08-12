const REGEX_URL = /^(?:https:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
const TWITCH_DOMAIN = 'twitch.tv';

const url = document.getElementById("urlInput");
const botaoGerar = document.getElementById("gerar");

function getVideoFromUrl(event) {
    event.preventDefault();
    botaoGerar.disabled = true;
    let urlText = url.value;
    if (!urlText) {
        botaoGerar.disabled = false;
        return;
    }
    let validUrl = REGEX_URL.test(urlText) && urlText.includes(TWITCH_DOMAIN);
    if (!validUrl) {
        botaoGerar.disabled = false;
        return;
    }
    if (!urlText.startsWith('https://')) {
        urlText = `https://${urlText}`
    }
    fetch(`/twitch/scrap?url=${urlText}`)
    .then(handleError)
    .then(async res => {
        const clipUrl = await res.text();
        generateDownload(clipUrl);
        botaoGerar.disabled = false;

    }).catch((err) => {
        console.log(err);
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

async function handleError(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return response;
}

document.getElementById("form").addEventListener("submit", getVideoFromUrl);
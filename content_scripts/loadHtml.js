function loadHtml(file, values) {
    return fetch(browser.runtime.getURL(file))
        .then((r) => r.text())
        .then((html) => {
            for (let key of Object.keys(values)) {
                html = html.replace(`{{${key}}}`, values[key]);
            }
            return html;
        })
        .then((html) => {
            return createElementFromHTML(html);
        });
}

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

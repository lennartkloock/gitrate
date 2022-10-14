document.addEventListener('turbo:load', (ev) => {
    if (ev.detail.url.startsWith('https://github.com/torvalds/linux')) {
        inject();
    }
});

inject();

function inject() {
    if (!document.getElementById('reviews-tab')) {
        let paramString = location.href.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        let enabled = queryString.get('tab') === 'reviews';
        if (enabled) {
            deselectAllTabs();
        }
        injectReviewsTab(enabled, 0);
    }
}

function injectReviewsTab(enabled, count) {
    const header = document.getElementById('repository-container-header');
    let linkList = document.evaluate('nav/ul', header).iterateNext();

    if (linkList) {
        fetch(browser.runtime.getURL('/reviews-tab.html'))
            .then(r => r.text())
            .then((html) => html
                .replace('{{enabled}}', enabled ? 'page' : 'false')
                .replace('{{selected}}', enabled ? 'selected' : '')
                .replace('{{count}}', count.toString())
                .replace('{{commentStart}}', count ? '' : '<!--')
                .replace('{{commentEnd}}', count ? '' : '-->'),
            )
            .then((html) => {
                linkList.appendChild(createElementFromHTML(html));
                let element = document.getElementById('reviews-tab');
                element.onclick = () => {
                    deselectAllTabs();
                    history.pushState({}, '', '?tab=reviews');
                    element.classList.add('selected');
                    element.setAttribute('aria-current', 'page');
                };
            });
    }
}

function deselectAllTabs() {
    const header = document.getElementById('repository-container-header');
    let linkList = document.evaluate('nav/ul', header).iterateNext();

    const xpath = document.evaluate('li/a', linkList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < xpath.snapshotLength; i++) {
        let link = xpath.snapshotItem(i);
        link.classList.remove('selected');
        link.removeAttribute('aria-current');
    }
}

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

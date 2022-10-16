function isRepo() {
    return document.getElementById('repository-container-header') != null;
}

document.addEventListener('turbo:load', () => inject());

inject();

function inject() {
    // Check if this page is a repo and the tab is not already present
    if (isRepo() && !document.getElementById('reviews-tab')) {
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
        loadHtml('/reviews-tab.html',
            {
                enabled: enabled ? 'page' : 'false',
                selected: enabled ? 'selected' : '',
                count: count.toString(),
                commentStart: count ? '' : '<!--',
                commentEnd: count ? '' : '-->',
            },
        )
            .then((html) => {
                linkList.appendChild(html);
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

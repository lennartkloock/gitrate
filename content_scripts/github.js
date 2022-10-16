function isRepo() {
    return document.getElementById('repository-container-header') != null;
}

function getRepo() {
    let path = location.pathname.split('/');
    if (path.length >= 3) {
        return `${path[1]}/${path[2]}`;
    }
    return null;
}

document.addEventListener('turbo:load', () => inject());

inject();

function inject() {
    // Check if this page is a repo and the tab is not already present
    if (isRepo() && !document.getElementById('reviews-tab')) {
        let paramString = location.href.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        const enabled = queryString.get('tab') === 'reviews';
        injectReviewsTab(enabled, 0);
        if (enabled) {
            injectReviewContent();
        }
    }
}

function injectReviewsTab(enabled, count) {
    const header = document.getElementById('repository-container-header');
    let tabList = document.evaluate('nav/ul', header).iterateNext();
    if (tabList) {
        if (enabled) {
            deselectAllTabs(tabList);
        }
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
                tabList.appendChild(html);
                let element = document.getElementById('reviews-tab');
                element.onclick = () => {
                    deselectAllTabs(tabList);
                    history.pushState({}, '', `/${getRepo()}?tab=reviews`);
                    element.classList.add('selected');
                    element.setAttribute('aria-current', 'page');
                    injectReviewContent();
                };
            });
    }
}

function injectReviewContent() {
    document.getElementById('repo-content-turbo-frame').remove();
}

function deselectAllTabs(tabList) {
    const xpath = document.evaluate('li/a', tabList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < xpath.snapshotLength; i++) {
        let link = xpath.snapshotItem(i);
        link.classList.remove('selected');
        link.removeAttribute('aria-current');
    }
}

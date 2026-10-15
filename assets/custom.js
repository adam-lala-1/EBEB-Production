
(function () {
    function changeDescriptionHeading() {
        document.querySelectorAll('h1').forEach(function (heading) {
            if (
                heading.textContent.trim() === 'Description' &&
                heading.parentElement.classList.contains('rte')
            ) {
                var h2 = document.createElement('h2');

                Array.from(heading.attributes).forEach(function (attr) {
                    h2.setAttribute(attr.name, attr.value);
                });

                h2.innerHTML = heading.innerHTML;
                heading.replaceWith(h2);
            }
        });
    }

    changeDescriptionHeading();

    var observer = new MutationObserver(changeDescriptionHeading);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();

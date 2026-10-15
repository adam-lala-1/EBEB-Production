
(function () {
    function changeDescriptionHeading() {
        document.querySelectorAll(".eeb-pdp_details-body h1").forEach(function (heading) {
            var h2 = document.createElement("h2");

            Array.from(heading.attributes).forEach(function (attr) {
                h2.setAttribute(attr.name, attr.value);
            });

            h2.innerHTML = heading.innerHTML;
            heading.replaceWith(h2);
        });
    }

    // Run immediately
    changeDescriptionHeading();

    // Run when the DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", changeDescriptionHeading);
    }

    // Handle dynamically loaded Shopify content
    var observer = new MutationObserver(function () {
        changeDescriptionHeading();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();

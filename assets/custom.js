document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".eeb-pdp_details-body h1").forEach(function (heading) {
        const h2 = document.createElement("h2");
        h2.innerHTML = heading.innerHTML;

        // Preserve existing attributes and classes
        Array.from(heading.attributes).forEach(function (attr) {
            h2.setAttribute(attr.name, attr.value);
        });

        heading.replaceWith(h2);
    });
});
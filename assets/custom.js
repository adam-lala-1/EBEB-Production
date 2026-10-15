
document.querySelectorAll(".eeb-pdp_details-body h1").forEach(function (heading) {
    console.log("Found H1:", heading, "| Text:", heading.textContent);

    var h2 = document.createElement("h2");

    Array.from(heading.attributes).forEach(function (attr) {
        h2.setAttribute(attr.name, attr.value);
    });

    h2.innerHTML = heading.innerHTML;
    heading.replaceWith(h2);

    console.log("Changed H1 to H2:", h2);
});

console.log(
    "Remaining H1 elements:",
    document.querySelectorAll(".eeb-pdp_details-body h1").length
);
console.log(
    "H2 elements:",
    document.querySelectorAll(".eeb-pdp_details-body h2").length
);

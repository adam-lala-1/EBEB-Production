console.log("Description body:", document.querySelector(".eeb-pdp_details-body"));

console.log(
    "Elements with eeb-pdp_details-body class:",
    document.querySelectorAll('[class*="eeb-pdp_details-body"]')
);

console.log(
    "All Description headings:",
    [...document.querySelectorAll("h1, h2")].map(el => ({
        tag: el.tagName,
        text: el.innerText,
        class: el.className,
        parent: el.parentElement?.className
    }))
);
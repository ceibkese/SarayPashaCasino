document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href="/tr/?m=account&t=instant_cashback"]');

    if (link) {
        e.preventDefault();
        window.location.href = "https://www.saraypasha.com";
    }
});

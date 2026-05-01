document.addEventListener('DOMContentLoaded', function () {
    var toggler = document.querySelector('.navbar-toggler');
    var navbar  = document.getElementById('navbarMain');

    if (!toggler || !navbar) return;

    // Take over from Bootstrap so our CSS transitions run cleanly
    toggler.removeAttribute('data-bs-toggle');
    toggler.removeAttribute('data-bs-target');

    // Toggle open / close on button click
    toggler.addEventListener('click', function () {
        var open = navbar.classList.toggle('show');
        toggler.setAttribute('aria-expanded', String(open));
    });

    // Close when tapping anywhere outside the menu or toggler
    document.addEventListener('click', function (e) {
        if (
            navbar.classList.contains('show') &&
            !navbar.contains(e.target) &&
            !toggler.contains(e.target)
        ) {
            navbar.classList.remove('show');
            toggler.setAttribute('aria-expanded', 'false');
        }
    });
});

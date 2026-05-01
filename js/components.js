(function () {
    var path = window.location.pathname;
    var inBlogs = path.indexOf('/blogs/') !== -1;
    var base = inBlogs ? '..' : '.';

    var filename = path.split('/').pop() || 'index.html';
    var activePage = 'none';
    if (filename === '' || filename === 'index.html') activePage = 'home';
    else if (filename === 'about.html') activePage = 'about';

    function inject(id, html) {
        var el = document.getElementById(id);
        if (el) el.outerHTML = html;
    }

    inject('site-header',
        '<header>' +
        '<nav class="navbar navbar-expand-lg custom-sticky-navbar">' +
        '<div class="container">' +
        '<a class="navbar-brand" href="' + base + '/index.html">' +
        '<img src="' + base + '/img/others/logo.png" alt="logo" class="navbar-logo" />' +
        '</a>' +
        '<button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false">' +
        '<span class="navbar-toggler-icon"></span>' +
        '</button>' +
        '<div class="collapse navbar-collapse" id="navbarMain">' +
        '<ul class="navbar-nav ms-auto">' +
        '<li class="nav-item' + (activePage === 'home' ? ' active' : '') + '">' +
        '<a class="nav-link" href="' + base + '/index.html">' +
        '<img src="' + base + '/img/others/home.svg" alt="Home" style="width:24px;height:auto;vertical-align:middle;margin-right:10px;">Home' +
        '</a></li>' +
        '<li class="nav-item' + (activePage === 'about' ? ' active' : '') + '">' +
        '<a class="nav-link" href="' + base + '/about.html">' +
        '<img src="' + base + '/img/others/about.svg" alt="About" style="width:24px;height:auto;vertical-align:middle;margin-right:10px;">About' +
        '</a></li>' +
        '</ul></div></div></nav></header>'
    );

    inject('site-footer',
        '<section class="footer-section">' +
        '<div class="container footer">' +
        '<div class="row footer">' +
        '<div class="col-md-8">' +
        '<div class="copyright">' +
        '<div class="logo-circle">' +
        '<img src="' + base + '/img/others/blog_logo.svg" alt="Shafiqul AI" style="height:24px;vertical-align:middle;">' +
        '</div>' +
        '<div class="copyright-text">' +
        '<span>&copy; <span id="currentYear"></span> Shafiqul AI | All rights reserved. </span>' +
        '<span class="footer-dev">Developed by Md Shafiqul Islam</span>' +
        '</div></div></div>' +
        '<div class="col-md-4">' +
        '<ul class="social-network">' +
        '<li><a target="_blank" href="mailto:mdshafiqul.islam603@gmail.com" title="Gmail"><img src="' + base + '/img/contact/gmail.svg" alt="Gmail"><span class="icon-label">Gmail</span></a></li>' +
        '<li><a target="_blank" href="https://www.linkedin.com/in/shafiqul-islam-sumon/" title="LinkedIn"><img src="' + base + '/img/contact/linkedin.svg" alt="LinkedIn"><span class="icon-label">LinkedIn</span></a></li>' +
        '<li><a target="_blank" href="https://github.com/shafiqul-islam-sumon" title="GitHub"><img src="' + base + '/img/contact/github.svg" alt="GitHub"><span class="icon-label">GitHub</span></a></li>' +
        '<li><a target="_blank" href="https://leetcode.com/u/shafiqul/" title="LeetCode"><img src="' + base + '/img/contact/leetcode.svg" alt="LeetCode"><span class="icon-label">LeetCode</span></a></li>' +
        '<li><a target="_blank" href="https://huggingface.co/shafiqul1357" title="Hugging Face"><img src="' + base + '/img/contact/huggingface.svg" alt="Hugging Face"><span class="icon-label">Hugging Face</span></a></li>' +
        '<li><a target="_blank" href="https://medium.com/@shafiqul-islam" title="Medium"><img src="' + base + '/img/contact/medium.svg" alt="Medium"><span class="icon-label">Medium</span></a></li>' +
        '</ul></div></div></div></section>'
    );

    var yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


// Reading progress bar
window.addEventListener('scroll', function () {
    var el = document.getElementById('reading-progress');
    if (!el) return;
    var scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    el.style.width = Math.min(scrolled, 100) + '%';
});

// Color rotation for slider cards (matches homepage)
const relatedCardColors = [
    '#358ccb', '#34A853', '#6f42c1', '#00897B', '#FF9D00', '#EA4335', '#FF5722',
];

// Fetch and load all blog posts
function fetchPosts(currentPostId) {
    fetch('../data/posts.json')
        .then(response => response.json())
        .then(posts => {

            posts = updateResourcePaths(posts);
            const currentIndex = posts.findIndex(post => post.id === currentPostId);
            const currentPost = posts[currentIndex];

            if (currentPost) {
                populateAuthorInfo(currentPost);  // ✅ pass only the selected post
            }

            displayPosts(posts);

            initializeSwiperSlider(currentIndex, posts);
        })
        .catch(error => console.error('Error loading posts:', error));
}

function populateAuthorInfo(post) {
    
    const authorNameElem = document.getElementById("author_name");
    const authorImgElem = document.getElementById("author_img");
    const publishedDateElem = document.getElementById("published_date");

    if (post.author) {
        authorNameElem.textContent = post.author;
    }

    if (post.author_img) {
        authorImgElem.src = post.author_img;
    } else {
        authorImgElem.src = "../img/author/shafiqul.jpg"; // fallback image
    }

    if (post.date) {
        publishedDateElem.textContent = `🗓️ ${post.date}`;
    }
}

function updateResourcePaths(posts){

    // go to parent directory
    for (let i = 0; i < posts.length; i++) {
        posts[i].image = "." + posts[i].image;
        posts[i].readMoreUrl = "." + posts[i].readMoreUrl;
    }

    return posts;
}

function displayPosts(posts) {
    const swiperWrapper = document.querySelector('#postContainer .swiper-wrapper');
    if (!swiperWrapper) return;
    swiperWrapper.innerHTML = '';
    document.getElementById('totalSlides').textContent = posts.length;
    posts.forEach((post, index) => {
        const postElement = createPostElement(post, index);
        swiperWrapper.appendChild(postElement);
    });
}

// Build a blog card matching the homepage card style (card-inner structure)
function createPostElement(post, colorIndex) {
    const postDiv = document.createElement('div');
    postDiv.className = 'blog-post';

    const card = document.createElement('div');
    card.className = 'card-inner';

    // Image container with rotating top-border colour
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.style.borderTopColor = relatedCardColors[colorIndex % relatedCardColors.length];

    const imageLink = document.createElement('a');
    imageLink.href = post.readMoreUrl;
    imageLink.target = '_blank';
    imageLink.rel = 'noopener noreferrer';

    const img = document.createElement('img');
    img.src = post.image;
    img.alt = post.title;
    imageLink.appendChild(img);
    imageContainer.appendChild(imageLink);
    card.appendChild(imageContainer);

    // Category chips
    if (post.category && post.category.length > 0) {
        const chipRow = document.createElement('div');
        chipRow.className = 'card-category-chips';
        post.category.forEach(cat => {
            const chip = document.createElement('span');
            chip.className = 'card-category-chip';
            chip.textContent = cat;
            chipRow.appendChild(chip);
        });
        card.appendChild(chipRow);
    }

    // Title link
    const titleLink = document.createElement('a');
    titleLink.href = post.readMoreUrl;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';

    const title = document.createElement('h2');
    title.innerText = post.title;
    titleLink.appendChild(title);
    card.appendChild(titleLink);

    const dateDiv = document.createElement('div');
    dateDiv.className = 'date';
    dateDiv.innerText = '🗓️ ' + post.date;
    card.appendChild(dateDiv);

    const description = document.createElement('p');
    description.innerText = post.description;
    card.appendChild(description);

    const readMoreButton = document.createElement('button');
    readMoreButton.className = 'read-more-button';
    const iconPath = '../img/others/read_more.png';
    readMoreButton.innerHTML = `<img src="${iconPath}" alt="Read More" style="width:24px; height:auto; vertical-align:middle; margin-right:10px;">Read More`;
    readMoreButton.addEventListener('click', () => {
        window.open(post.readMoreUrl, '_blank', 'noopener');
    });
    card.appendChild(readMoreButton);

    postDiv.appendChild(card);

    const slideDiv = document.createElement('div');
    slideDiv.className = 'swiper-slide';
    slideDiv.appendChild(postDiv);
    return slideDiv;
}

// Function to initialize the Swiper slider
function initializeSwiperSlider(currentIndex, posts) {
    const initialSlide = determineInitialSlide(currentIndex, posts);

    const swiper = new Swiper('#postContainer', {
        slidesPerView: 3,
        spaceBetween: 24,
        initialSlide: initialSlide,
        navigation: false,
        breakpoints: {
            0:   { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 24 }
        },
        on: {
            init: function () {
                updateSlideProgress(this.activeIndex + 1, posts.length);
                updateNavButtons(this);
            },
            slideChange: function () {
                updateSlideProgress(this.activeIndex + 1, posts.length);
                updateNavButtons(this);
            }
        }
    });

    const prevBtn = document.querySelector('.related-posts-wrapper .swiper-button-prev');
    const nextBtn = document.querySelector('.related-posts-wrapper .swiper-button-next');
    if (prevBtn) prevBtn.addEventListener('click', () => swiper.slidePrev());
    if (nextBtn) nextBtn.addEventListener('click', () => swiper.slideNext());
}

function updateNavButtons(swiper) {
    const prev = document.querySelector('.related-posts-wrapper .swiper-button-prev');
    const next = document.querySelector('.related-posts-wrapper .swiper-button-next');
    if (prev) prev.classList.toggle('swiper-button-disabled', swiper.isBeginning);
    if (next) next.classList.toggle('swiper-button-disabled', swiper.isEnd);
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function highlightLeftmostCard(leftIndex) {
    document.querySelectorAll('#postContainer .swiper-slide').forEach((slide, index) => {
        const cardInner = slide.querySelector('.card-inner');
        if (!cardInner) return;
        if (index === leftIndex) {
            const color = relatedCardColors[leftIndex % relatedCardColors.length];
            cardInner.style.backgroundColor = hexToRgba(color, 0.08);
        } else {
            cardInner.style.backgroundColor = '';
        }
    });
}

function updateSlideProgress(current, total) {
    document.getElementById('currentSlide').textContent = current;
    const fill = document.getElementById('slideProgressFill');
    if (fill) fill.style.width = Math.round((current / total) * 100) + '%';
    highlightLeftmostCard(current - 1);
}

// Determine the initial slide position based on the current post index
function determineInitialSlide(currentIndex, posts) {  // Add posts parameter
    if (currentIndex === 0) {
        return 0;  // If the current post is the first post, show it at the start
    } else if (currentIndex === posts.length - 1) {
        return currentIndex - 2 >= 0 ? currentIndex - 2 : currentIndex - 1;  // Show at the end
    } else {
        return currentIndex - 1;  // Show the current post in the middle
    }
}

function initScrollSpy() {
    const sidebar = document.getElementById('tocSidebar');
    if (!sidebar) return;

    const links = Array.from(sidebar.querySelectorAll('a[href^="#"]'));
    const targets = links.map(link => ({
        link,
        el: document.getElementById(link.getAttribute('href').slice(1))
    })).filter(item => item.el);

    if (targets.length === 0) return;

    let lastActive = null;

    function update() {
        const offset = 120;
        let active = targets[0];
        for (const t of targets) {
            if (t.el.getBoundingClientRect().top <= offset) {
                active = t;
            }
        }
        if (active === lastActive) return;
        lastActive = active;
        links.forEach(l => l.classList.remove('toc-active'));
        active.link.classList.add('toc-active');
        active.link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

window.onload = function () {
    // Extract post ID from URL path, e.g., blog_6.html
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);  // e.g., blog_6.html
    const idMatch = filename.match(/blog_(\d+)\.html/);

    if (idMatch && idMatch[1]) {
        const currentPostId = parseInt(idMatch[1], 10);
        fetchPosts(currentPostId);
        initScrollSpy();
    } else {
        console.error("❌ Could not extract blog ID from URL.");
    }
};

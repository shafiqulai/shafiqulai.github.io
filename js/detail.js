
// Fetch and load all blog posts
function fetchPosts(currentPostId) {
    fetch('../data/posts.json')
        .then(response => response.json())
        .then(posts => {

            posts = updateResourcePaths(posts)
            const currentIndex = posts.findIndex(post => post.id === currentPostId);
            const currentPost = posts[currentIndex];

            if (currentPost) {
                populateAuthorInfo(currentPost);  // ✅ pass only the selected post
            }

            displayPosts(posts);

            // Ensure the Slick slider is initialized only after posts are appended
            setTimeout(() => {
                initializeSlickSlider(currentIndex, posts);
            }, 100); // Delay initialization slightly to ensure DOM elements are ready
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
        console.log(post.author_img);
        authorImgElem.src = post.author_img;
    } else {
        authorImgElem.src = "../img/author/shafiqul.jpg"; // fallback image
    }

    if (post.date) {
        publishedDateElem.textContent = ` - ${post.date}`;
    }
}

function updateResourcePaths(posts){

    // go to parent directory
    for (let i = 0; i < posts.length; i++) {
        posts[i].image = "." + posts[i].image;
        posts[i].slide = "." + posts[i].slide;
        posts[i].readMoreUrl = "." + posts[i].readMoreUrl;
    }

    return posts
}

function displayPosts(posts) {
    const postContainer = document.getElementById('postContainer');

    // Clear container
    postContainer.innerHTML = '';
    const totalSlides = posts.length;

    // Set the total number of slides in the counter
    document.getElementById('totalSlides').textContent = totalSlides;

    // Append all blog posts to the container
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postContainer.appendChild(postElement);
    });
}


// Function to create a blog post element dynamically
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'blog-post slick-slide'; // Adding Slick-specific class to ensure proper styling

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const imageLink = document.createElement('a');
    imageLink.href = `${post.readMoreUrl}?id=${post.id}`;
    imageLink.target = "_blank"; // Ensure it opens in a new tab
    imageLink.rel = "noopener noreferrer"; // Security reasons

    const img = document.createElement('img');
    img.src = post.image;
    img.alt = post.title;
    
    imageLink.appendChild(img);
    imageContainer.appendChild(imageLink);
    postDiv.appendChild(imageContainer);

    const titleLink = document.createElement('a');
    titleLink.href = `${post.readMoreUrl}?id=${post.id}`;
    titleLink.target = "_blank"; // Ensure it opens in a new tab
    titleLink.rel = "noopener noreferrer"; // Security reasons

    const title = document.createElement('h2');
    title.innerText = post.title;
    titleLink.appendChild(title);
    postDiv.appendChild(titleLink);

    const dateDiv = document.createElement('div');
    dateDiv.className = 'date';
    dateDiv.innerText = '🗓️ ' + post.date;
    postDiv.appendChild(dateDiv);

    const description = document.createElement('p');
    description.innerText = post.description;
    postDiv.appendChild(description);

    const readMoreButton = document.createElement('button');
    readMoreButton.className = 'read-more-button';
    readMoreButton.innerText = 'Read More';
    readMoreButton.addEventListener('click', () => {
        window.open(`${post.readMoreUrl}?id=${post.id}`, '_blank', 'noopener');
    });
    postDiv.appendChild(readMoreButton);

    return postDiv;
}

// Function to initialize the Slick slider
function initializeSlickSlider(currentIndex, posts) {

    let initialSlide = determineInitialSlide(currentIndex, posts);  // Pass posts to determineInitialSlide

    $('#postContainer').slick({
        slidesToShow: 3,  // Show 3 posts at once
        slidesToScroll: 1,
        dots: false,  // Disable dots
        arrows: true, // Enable arrows
        infinite: false,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">&#10094;</button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button">&#10095;</button>',
        initialSlide: initialSlide, // Set the initial slide
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1, // Show only 1 post for smaller screens
                }
            }
        ]
    });

    // Update the slide counter after the slider changes
    $('#postContainer').on('afterChange', function (event, slick, currentSlide) {
        document.getElementById('currentSlide').textContent = currentSlide + 1;
    });

    // Set the initial slide counter value after initializing
    document.getElementById('currentSlide').textContent = initialSlide + 1;
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

function getSmoothScrol() {
    // Initialize SmoothScroll
		var scroll = new SmoothScroll('.blg-toc-container a', {
            speed: 800,  // The speed of the scroll in milliseconds
            offset: 0,   // Offset for fixed headers or other elements on top
            easing: 'easeInOutCubic' // Easing pattern to use
        });

        // Initialize SmoothScroll specifically for the scroll-up link
        var scrollUp = new SmoothScroll('.scrollup', {
                speed: 800,  // The speed of the scroll in milliseconds
                easing: 'easeInOutCubic' // Easing pattern to use
        });
}

window.onload = function () {
    // Get the blog ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentPostId = parseInt(urlParams.get('id'), 10); // Assuming IDs are integers

    fetchPosts(currentPostId);
    getSmoothScrol()

};
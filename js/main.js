let currentPostIndex = 0;
let categoryCounts = {};
const initialPostsToShow = 6; // Shown on first load
const postsPerLoad = 3;       // Shown on each click
let posts = []; // Holds all posts
let displayedPosts = []; // Holds the filtered posts for display
let totalPostsCount = 0; // Stores the total number of posts
let mostRecentPost = null; // Store the most recent post separately

// Function to fetch the posts from the JSON file
function fetchPosts() {
    fetch('metadata/posts.json')
        .then(response => response.json())
        .then(data => {
            totalPostsCount = data.length; // Store total number of posts
            countCategories(data); // Count categories and update the category list

            // Sort posts by date (newest first)
            posts = data.sort((a, b) => new Date(b.date.replace(',', '')) - new Date(a.date.replace(',', '')));

            // Extract the most recent post and store it separately
            mostRecentPost = posts.shift();
            displayTopBlogPost(mostRecentPost); // Display the most recent post

            // Display the remaining posts
            displayedPosts = [...posts]; // Copy the remaining posts
            displayPosts(true); // Display the initial set of posts

            updateButtonVisibility(); // Update Load More button visibility
        })
        .catch(error => console.error('Error fetching posts:', error));
}

// Function to display the posts
function displayPosts(clear = false) {
    const container = document.getElementById('postContainer');
    if (clear) {
        container.innerHTML = '';  // Clear the container when displaying new category or filtering
        currentPostIndex = 0;      // Reset the post index
    }

    const postsToShow = clear ? initialPostsToShow : postsPerLoad;

    // Append new posts
    for (let i = currentPostIndex; i < currentPostIndex + postsToShow; i++) {
        if (i >= displayedPosts.length) break;

        const post = displayedPosts[i];  // Use the filtered posts
        const postDiv = document.createElement('div');
        postDiv.className = 'col-sm-4 blog-post';
        postDiv.setAttribute('data-id', post.id); // Store post ID

        createPostElements(post, postDiv); // Add elements to the post

        container.appendChild(postDiv); // Append the post to the container
    }

    currentPostIndex += postsToShow; // Increment the post index
    updateButtonVisibility(); // Update button visibility
}

// Function to display the most recent post in "top-blg-container"
function displayTopBlogPost(post) {
    const topBlogContainer = document.getElementById('top-blg-container');
    topBlogContainer.innerHTML = ''; // Clear previous content

    // Create the image container and link
    const imgContainer = document.createElement('div');
    imgContainer.className = 'col-md-6 top-blg-img-container';

    const imgLink = document.createElement('a');
    imgLink.href = `${post.readMoreUrl}?id=${post.id}`;
    imgLink.target = '_blank';
    imgLink.rel = 'noopener noreferrer';

    const img = document.createElement('img');
    img.src = post.image;
    img.alt = post.title;

    imgLink.appendChild(img);
    imgContainer.appendChild(imgLink);

    // Create the description container
    const descContainer = document.createElement('div');
    descContainer.className = 'col-md-6 top-blg-desc-container';

    const titleLink = document.createElement('a');
    titleLink.href = `${post.readMoreUrl}?id=${post.id}`;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';

    const title = document.createElement('h2');
    title.innerText = post.title;
    titleLink.appendChild(title);
    descContainer.appendChild(titleLink);

    const dateDiv = document.createElement('div');
    dateDiv.className = 'date';
    dateDiv.innerText = '🗓️ ' + post.date;
    descContainer.appendChild(dateDiv);

    const description = document.createElement('p');
    description.innerText = post.description;
    descContainer.appendChild(description);

    const readMoreButton = document.createElement('button');
    readMoreButton.className = 'read-more-button';
    const iconPath = './img/others/read_more.png';
    readMoreButton.innerHTML = `<img src="${iconPath}" alt="Read More" style="width:24px; height:auto; vertical-align:middle; margin-right:10px;">Read More`;

    readMoreButton.addEventListener('click', () => {
        window.open(`${post.readMoreUrl}?id=${post.id}`, '_blank', 'noopener');
    });
    descContainer.appendChild(readMoreButton);

    // Append both containers to the top blog container
    topBlogContainer.appendChild(imgContainer);
    topBlogContainer.appendChild(descContainer);
}


// Helper function to create elements for a post
function createPostElements(post, postDiv) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const imageLink = document.createElement('a');
    imageLink.href = `${post.readMoreUrl}?id=${post.id}`;
    imageLink.target = "_blank";
    imageLink.rel = "noopener noreferrer";

    const img = document.createElement('img');
    img.src = post.image;
    img.alt = post.title;
    imageLink.appendChild(img);
    imageContainer.appendChild(imageLink);
    postDiv.appendChild(imageContainer);

    const titleLink = document.createElement('a');
    titleLink.href = `${post.readMoreUrl}?id=${post.id}`;
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";

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

    const iconPath = './img/others/read_more.png';
    readMoreButton.innerHTML = `<img src="${iconPath}" alt="Read More" style="width:24px; height:auto; vertical-align:middle; margin-right:10px;">Read More`;

    readMoreButton.addEventListener('click', () => {
        window.open(`${post.readMoreUrl}?id=${post.id}`, '_blank', 'noopener');
    });
    postDiv.appendChild(readMoreButton);
}

// Function to update the Load More link's visibility
function updateButtonVisibility() {
    const link = document.getElementById('loadMoreLink');
    link.style.visibility = displayedPosts.length > initialPostsToShow && currentPostIndex < displayedPosts.length ? 'visible' : 'hidden';
}

// Function to load more posts when the link is clicked
function loadMorePosts(event) {
    event.preventDefault();
    displayPosts();
}

// Category data and generation
function countCategories(posts) {
    categoryCounts = {};
    posts.forEach(post => {
        post.category.forEach(category => {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
    });
    generateCategories();
}

// Function to generate categories dynamically
function generateCategories() {
    const categoryContainer = document.getElementById('categoryList');
    categoryContainer.innerHTML = '';

    const categoryIcons = getCategoryIcons();

    // "All" option
    let listItem = document.createElement('li');
    let link = document.createElement('a');
    link.href = "#";

    const allIcon = categoryIcons["All"];
    const allIconHTML = allIcon ? `<img src="${allIcon}" alt="All" style="width:20px; height:auto; vertical-align:middle; margin-right:10px;">` : '';
    link.innerHTML = `${allIconHTML}<b>All (${totalPostsCount})</b>`;
    link.addEventListener('click', () => filterPostsByCategory('All'));
    listItem.appendChild(link);
    categoryContainer.appendChild(listItem);

    // Other categories
    for (const [category, count] of Object.entries(categoryCounts)) {
        listItem = document.createElement('li');
        link = document.createElement('a');
        link.href = "#";

        const iconPath = categoryIcons[category];
        const iconHTML = iconPath ? `<img src="${iconPath}" alt="${category}" style="width:24px; height:auto; vertical-align:middle; margin-right:10px;">` : '';

        link.innerHTML = `${iconHTML}${category} (${count})`;
        link.addEventListener('click', () => filterPostsByCategory(category));
        listItem.appendChild(link);
        categoryContainer.appendChild(listItem);
    }
}

// Function to filter posts by category
function filterPostsByCategory(category) {
    currentPostIndex = 0;
    if (category === 'All') {
        // Show all posts, including the most recent post
        displayedPosts = [mostRecentPost, ...posts];
    } else {
        // Filter both the most recent post and the other posts
        displayedPosts = [
            ...(mostRecentPost && mostRecentPost.category.includes(category) ? [mostRecentPost] : []),
            ...posts.filter(post => post.category.includes(category))
        ];
    }

    displayPosts(true);
    updateButtonVisibility();
}

function getCategoryIcons() {
    return {
        "All": "./img/category/all.png",
        "Agent": "./img/category/agent.png",
        "Chatbot": "./img/category/chatbot.png",
        "Streamlit": "./img/category/streamlit.svg",
        "Hugging Face": "./img/category/huggingface.svg",
        "Docker": "./img/category/docker.svg",
        "Git": "./img/category/git.svg",
        "Gradio": "./img/category/gradio.svg",
        "RAG": "./img/category/rag.png",
        "LangChain": "./img/category/langchain.svg"
    };
}


// Run after the page loads
window.onload = function() {
    fetchPosts();
    const loadMoreLink = document.getElementById('loadMoreLink');
    const iconPath = './img/others/load_more.png';
    loadMoreLink.innerHTML = `<img src="${iconPath}" alt="Load More" style="width:24px; height:auto; vertical-align:middle; margin-right:10px;">Load More`;

    if (loadMoreLink) {
        loadMoreLink.addEventListener('click', loadMorePosts);
    }
};

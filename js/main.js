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
    fetch('data/posts.json')
        .then(response => response.json())
        .then(data => {
            totalPostsCount = data.length; // Store total number of posts
            countCategories(data); // Count categories and update the category list

            // Sort posts by date (newest first)
            posts = data.sort((a, b) => new Date(b.date.replace(/,/g, '')) - new Date(a.date.replace(/,/g, '')));

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

    // Empty state
    if (clear && displayedPosts.length === 0) {
        container.innerHTML = `
            <div class="no-posts-state">
                <img src="./img/others/categories.png" alt="" style="width:40px;opacity:0.3;margin-bottom:12px;">
                <p>No posts found in this category.</p>
            </div>`;
        return;
    }

    const postsToShow = clear ? initialPostsToShow : postsPerLoad;

    // Append new posts
    for (let i = currentPostIndex; i < currentPostIndex + postsToShow; i++) {
        if (i >= displayedPosts.length) break;

        const post = displayedPosts[i];
        const postDiv = document.createElement('div');
        postDiv.className = 'col-sm-4 blog-post';
        postDiv.setAttribute('data-id', post.id);

        createPostElements(post, postDiv, i);
        container.appendChild(postDiv);
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
    imgContainer.className = 'top-blg-img-container';

    const imgLink = document.createElement('a');
    imgLink.href = post.readMoreUrl;
    imgLink.target = '_blank';
    imgLink.rel = 'noopener noreferrer';

    const img = document.createElement('img');
    img.src = post.image;
    img.alt = post.title;

    imgLink.appendChild(img);
    imgContainer.appendChild(imgLink);

    const badge = document.createElement('span');
    badge.className = 'featured-badge';
    badge.textContent = 'Latest';
    imgContainer.appendChild(badge);

    // Create the description container
    const descContainer = document.createElement('div');
    descContainer.className = 'top-blg-desc-container';

    const titleLink = document.createElement('a');
    titleLink.href = post.readMoreUrl;
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
        window.open(post.readMoreUrl, '_blank', 'noopener');
    });
    descContainer.appendChild(readMoreButton);

    // Append both containers to the top blog container
    topBlogContainer.appendChild(imgContainer);
    topBlogContainer.appendChild(descContainer);

}


const cardTopColors = [
    '#358ccb', // blue
    '#34A853', // green
    '#6f42c1', // purple
    '#00897B', // teal
    '#FF9D00', // amber
    '#EA4335', // red
    '#FF5722', // deep orange
];

// Helper function to create elements for a post
function createPostElements(post, postDiv, colorIndex = 0) {
    const card = document.createElement('div');
    card.className = 'card-inner';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.style.borderTopColor = cardTopColors[colorIndex % cardTopColors.length];

    const imageLink = document.createElement('a');
    imageLink.href = post.readMoreUrl;
    imageLink.target = "_blank";
    imageLink.rel = "noopener noreferrer";

    const img = document.createElement('img');
    img.src = post.image;
    img.alt = post.title;
    imageLink.appendChild(img);
    imageContainer.appendChild(imageLink);
    card.appendChild(imageContainer);

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

    const titleLink = document.createElement('a');
    titleLink.href = post.readMoreUrl;
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";

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

    const iconPath = './img/others/read_more.png';
    readMoreButton.innerHTML = `<img src="${iconPath}" alt="Read More" style="width:24px; height:auto; vertical-align:middle; margin-right:10px;">Read More`;

    readMoreButton.addEventListener('click', () => {
        window.open(post.readMoreUrl, '_blank', 'noopener');
    });
    card.appendChild(readMoreButton);

    postDiv.appendChild(card);
}

// Function to update the Load More link's visibility
function updateButtonVisibility() {
    const link = document.getElementById('loadMoreLink');
    const remaining = displayedPosts.length - currentPostIndex;
    if (displayedPosts.length > initialPostsToShow && currentPostIndex < displayedPosts.length) {
        link.style.display = 'inline-block';
        const iconPath = './img/others/load_more.png';
        link.innerHTML = `<img src="${iconPath}" alt="Load More" style="width:24px; height:auto; vertical-align:middle; margin-right:10px;">Load More (${remaining} remaining)`;
    } else {
        link.style.display = 'none';
    }
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

    // "All" option — active by default on load
    let listItem = document.createElement('li');
    let link = document.createElement('a');
    link.href = "#";

    const allIcon = categoryIcons["All"];
    const allIconHTML = allIcon ? `<img src="${allIcon}" alt="All" style="width:20px; height:auto; vertical-align:middle; margin-right:10px;">` : '';
    link.innerHTML = `${allIconHTML}<b>All (${totalPostsCount})</b>`;
    link.addEventListener('click', (e) => { e.preventDefault(); filterPostsByCategory('All', e.currentTarget); });
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
        link.addEventListener('click', (e) => { e.preventDefault(); filterPostsByCategory(category, e.currentTarget); });
        listItem.appendChild(link);
        categoryContainer.appendChild(listItem);
    }
}

// Function to filter posts by category
function filterPostsByCategory(category, clickedLink) {
    currentPostIndex = 0;
    if (category === 'All') {
        displayedPosts = [...posts];
    } else {
        displayedPosts = [
            ...(mostRecentPost && mostRecentPost.category.includes(category) ? [mostRecentPost] : []),
            ...posts.filter(post => post.category.includes(category))
        ];
    }

    // Update active state
    document.querySelectorAll('#categoryList a').forEach(a => a.classList.remove('active'));
    if (clickedLink) clickedLink.classList.add('active');

    displayPosts(true);
    updateButtonVisibility();
}

function getCategoryIcons() {
    return {
        "All": "./img/others/all.png",
        "Agent": "./img/technical_stack/agent.png",
        "Chatbot": "./img/technical_stack/chatbot.png",
        "Streamlit": "./img/technical_stack/streamlit.svg",
        "Hugging Face": "./img/technical_stack/huggingface.svg",
        "Docker": "./img/technical_stack/docker.svg",
        "Git": "./img/technical_stack/git.svg",
        "Gradio": "./img/technical_stack/gradio.svg",
        "RAG": "./img/technical_stack/rag.png",
        "LangChain": "./img/technical_stack/langchain.svg",
        "Qdrant": "./img/technical_stack/qdrant.svg",
        "ChromaDB": "./img/technical_stack/chroma.svg",
        "OpenAI": "./img/technical_stack/openai.svg",
        "Gemini": "./img/technical_stack/gemini.svg",
        "Llama": "./img/technical_stack/llama.png",
        "Recommendation": "./img/technical_stack/recommendation.png"
    };
}


// Run after the page loads
window.onload = function() {
    fetchPosts();
    const loadMoreLink = document.getElementById('loadMoreLink');
    if (loadMoreLink) {
        loadMoreLink.addEventListener('click', loadMorePosts);
    }
};

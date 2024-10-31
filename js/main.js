let currentPostIndex = 0;
let categoryCounts = {};
const postsPerLoad = 3; // Number of posts to load each time
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

            // Sort posts by date (newest first)
            posts = data.sort((a, b) => new Date(b.date.replace(',', '')) - new Date(a.date.replace(',', '')));

            // Extract the most recent post and store it separately
            mostRecentPost = posts.shift();
            displayTopBlogPost(mostRecentPost); // Display the most recent post

            // Display the remaining posts
            displayedPosts = [...posts]; // Copy the remaining posts
            displayPosts(true); // Display the initial set of posts

            countCategories(data); // Count categories and update the category list
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

    // Append new posts
    for (let i = currentPostIndex; i < currentPostIndex + postsPerLoad; i++) {
        if (i >= displayedPosts.length) break;

        const post = displayedPosts[i];  // Use the filtered posts
        const postDiv = document.createElement('div');
        postDiv.className = 'col-sm-4 blog-post';
        postDiv.setAttribute('data-id', post.id); // Store post ID

        createPostElements(post, postDiv); // Add elements to the post

        container.appendChild(postDiv); // Append the post to the container
    }

    currentPostIndex += postsPerLoad; // Increment the post index
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
    dateDiv.innerText = post.date;
    descContainer.appendChild(dateDiv);

    const description = document.createElement('p');
    description.innerText = post.description;
    descContainer.appendChild(description);

    const readMoreLink = document.createElement('a');
    readMoreLink.href = `${post.readMoreUrl}?id=${post.id}`;
    readMoreLink.className = 'read-more';
    readMoreLink.innerText = 'Read More';
    readMoreLink.target = '_blank';
    readMoreLink.rel = 'noopener noreferrer';
    descContainer.appendChild(readMoreLink);

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
    dateDiv.innerText = post.date;
    postDiv.appendChild(dateDiv);

    const description = document.createElement('p');
    description.innerText = post.description;
    postDiv.appendChild(description);

    const readMoreLink = document.createElement('a');
    readMoreLink.href = `${post.readMoreUrl}?id=${post.id}`;
    readMoreLink.className = 'read-more';
    readMoreLink.innerText = "Read More";
    readMoreLink.target = "_blank";
    readMoreLink.rel = "noopener noreferrer";
    postDiv.appendChild(readMoreLink);
}

// Function to update the Load More link's visibility
function updateButtonVisibility() {
    const link = document.getElementById('loadMoreLink');
    link.style.visibility = currentPostIndex >= displayedPosts.length ? 'hidden' : 'visible';
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

    let listItem = document.createElement('li');
    let link = document.createElement('a');
    link.href = "#";
    link.textContent = `All (${totalPostsCount})`; // Include the total posts count
    link.addEventListener('click', () => filterPostsByCategory('All'));
    listItem.appendChild(link);
    categoryContainer.appendChild(listItem);

    for (const [category, count] of Object.entries(categoryCounts)) {
        listItem = document.createElement('li');
        link = document.createElement('a');
        link.href = "#";
        link.textContent = `${category} (${count})`;
        link.addEventListener('click', () => filterPostsByCategory(category));
        listItem.appendChild(link);
        categoryContainer.appendChild(listItem);
    }
}

// Function to filter posts by category
function filterPostsByCategory(category) {
    currentPostIndex = 0;
    displayedPosts = category === 'All' ? [mostRecentPost, ...posts] : posts.filter(post => post.category.includes(category));
    displayPosts(true);
    updateButtonVisibility();
}

// Run after the page loads
window.onload = function() {
    fetchPosts();
    const loadMoreLink = document.getElementById('loadMoreLink');
    if (loadMoreLink) {
        loadMoreLink.addEventListener('click', loadMorePosts);
    }
};

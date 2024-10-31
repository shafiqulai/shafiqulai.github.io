
let currentPostIndex = 0;
let categoryCounts = {};
const postsPerLoad = 3; // Number of posts to load each time
let posts = [];
let displayedPosts = []; // This will hold the filtered posts for display

// Function to fetch the posts from the JSON file
function fetchPosts() {
    fetch('data/posts.json')
        .then(response => response.json())
        .then(data => {
            posts = data.sort((a, b) => new Date(b.date.replace(',', '')) - new Date(a.date.replace(',', '')));
            displayedPosts = posts; // Initially display all posts
            displayPosts(true); // Display the initial set of posts and clear any previous
            countCategories(data); // Count categories and update the category list
            updateButtonVisibility(); // Check whether to show the Load More link
        })
        .catch(error => console.error('Error fetching posts:', error));
}

// Function to display the posts
function displayPosts(clear = false) {
    const container = document.getElementById('postContainer');
    if (clear) {
        container.innerHTML = '';  // Clear the container when displaying a new category or filtering
        currentPostIndex = 0;      // Reset the post index when clearing
    }

    // Append new posts
    for (let i = currentPostIndex; i < currentPostIndex + postsPerLoad; i++) {
        if (i >= displayedPosts.length) break;

        const post = displayedPosts[i];  // Make sure to use the filtered posts
        const postDiv = document.createElement('div');
        postDiv.className = 'col-sm-4 blog-post'; // Use Bootstrap's col-sm-4 for 3 posts in a row
        postDiv.setAttribute('data-id', post.id); // Store post ID for future reference

        // Constructing elements
        createPostElements(post, postDiv);

        container.appendChild(postDiv); // Append the post directly to the container (Bootstrap will handle rows)
    }

    currentPostIndex += postsPerLoad; // Increment the index for next posts
    updateButtonVisibility();

}

function createPostElements(post, postDiv) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const imageLink = document.createElement('a');
    imageLink.href = `${post.readMoreUrl}?id=${post.id}`; // Attach blog post ID to the readMoreUrl
    imageLink.target = "_blank"; // Opens the link in a new tab
    imageLink.rel = "noopener noreferrer"; // Enhances security

    const img = document.createElement('img');
    img.src = post.image;
    img.alt = post.title;
    imageLink.appendChild(img);
    imageContainer.appendChild(imageLink);
    postDiv.appendChild(imageContainer);

    const titleLink = document.createElement('a');
    titleLink.href = `${post.readMoreUrl}?id=${post.id}`; // Attach blog post ID to the readMoreUrl
    titleLink.target = "_blank"; // Opens the link in a new tab
    titleLink.rel = "noopener noreferrer"; // Enhances security

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
    readMoreLink.href = `${post.readMoreUrl}?id=${post.id}`; // Attach blog post ID to the readMoreUrl
    readMoreLink.className = 'read-more';
    readMoreLink.innerText = "Read More";
    readMoreLink.target = "_blank"; // Ensure it opens in a new tab
    readMoreLink.rel = "noopener noreferrer"; // Security reasons
    postDiv.appendChild(readMoreLink);
}

// Function to update the Load More link's visibility
function updateButtonVisibility() {
    const link = document.getElementById('loadMoreLink');
    link.style.visibility = currentPostIndex >= displayedPosts.length ? 'hidden' : 'visible';
}

// Function to load more posts when the link is clicked
function loadMorePosts(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    displayPosts();
}

// Category data and generation
function countCategories(posts) {
    categoryCounts = {}; // Reset counts
    posts.forEach(post => {
        post.category.forEach(category => {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
    });
    generateCategories(); // Regenerate the categories after counting
}

// Function to generate the category dynamically
function generateCategories() {
    const categoryContainer = document.getElementById('categoryList');
    categoryContainer.innerHTML = ''; // Clear existing categories

    let totalPosts = posts.length;
    let listItem = document.createElement('li');
    let link = document.createElement('a');
    link.href = "#";
    link.textContent = `All (${totalPosts})`;
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
    currentPostIndex = 0; // Reset index for new category
    // If "All" is selected, show all posts, otherwise filter by category
    displayedPosts = category === 'All' ? posts : posts.filter(post => post.category.includes(category));
    displayPosts(true); // Clear previous posts and display the filtered ones
    updateButtonVisibility();
}

// Add an event listener to run after the entire page has loaded (styles, images, etc.)
window.onload = function() {
    fetchPosts(); // Fetch posts when the page fully loads
    const loadMoreLink = document.getElementById('loadMoreLink');
    if (loadMoreLink) {
        loadMoreLink.addEventListener('click', loadMorePosts);
    }
};

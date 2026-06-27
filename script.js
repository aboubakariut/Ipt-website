// Joke API Configuration
const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke';

// DOM Elements
const jokeText = document.getElementById('jokeText');
const jokeBtn = document.getElementById('jokeBtn');
const shareBtn = document.getElementById('shareBtn');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');

let currentJoke = null;

// Event Listeners
jokeBtn.addEventListener('click', getJoke);
shareBtn.addEventListener('click', shareJoke);

/**
 * Fetch a random joke from the API
 */
async function getJoke() {
    try {
        // Show loading state
        showLoading(true);
        hideError();
        
        // Disable buttons
        jokeBtn.disabled = true;
        shareBtn.disabled = true;
        
        // Fetch joke from API
        const response = await fetch(JOKE_API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store current joke
        currentJoke = {
            setup: data.setup,
            punchline: data.punchline
        };
        
        // Display the joke
        displayJoke();
        
    } catch (error) {
        console.error('Error fetching joke:', error);
        showError('Oops! Could not fetch a joke. Please try again.');
    } finally {
        // Hide loading state
        showLoading(false);
        
        // Enable buttons
        jokeBtn.disabled = false;
        shareBtn.disabled = false;
    }
}

/**
 * Display the joke on the screen
 */
function displayJoke() {
    if (currentJoke) {
        const jokeHTML = `
            <div style="text-align: left;">
                <strong style="font-size: 1.1em; color: #667eea;">Setup:</strong><br>
                ${currentJoke.setup}<br><br>
                <strong style="font-size: 1.1em; color: #764ba2;">Punchline:</strong><br>
                ${currentJoke.punchline}
            </div>
        `;
        jokeText.innerHTML = jokeHTML;
    }
}

/**
 * Share the joke to clipboard or social media
 */
function shareJoke() {
    if (!currentJoke) {
        showError('No joke to share. Get a joke first!');
        return;
    }
    
    const jokeContent = `${currentJoke.setup}\n\n${currentJoke.punchline}`;
    
    // Try to use Web Share API (mobile friendly)
    if (navigator.share) {
        navigator.share({
            title: 'Check out this joke!',
            text: jokeContent
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(jokeContent).then(() => {
            showSuccess('Joke copied to clipboard!');
        }).catch(err => {
            console.error('Error copying to clipboard:', err);
            showError('Could not copy joke to clipboard');
        });
    }
}

/**
 * Show loading indicator
 */
function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
}

/**
 * Show error message
 */
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

/**
 * Hide error message
 */
function hideError() {
    errorMsg.style.display = 'none';
}

/**
 * Show success message
 */
function showSuccess(message) {
    errorMsg.textContent = message;
    errorMsg.style.color = '#10b981';
    errorMsg.style.display = 'block';
    
    setTimeout(() => {
        hideError();
        errorMsg.style.color = '#f5576c';
    }, 3000);
}

// Load a joke when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Random Joke Generator loaded!');
    // Optionally, load a joke automatically
    // getJoke();
});

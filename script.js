// // Part 1: UI only. Search behaviour will be added in Part 2.
// // Get DOM Elements
// const searchForm = document.getElementById('search-form');
// const searchInput = document.getElementById('search-input');
// const resultsContainer = document.getElementById('results');
// const statusElement = document.getElementById('status');
// const categoryChips = document.querySelectorAll('.chip');
// const clearBtn = document.getElementById('clear-btn');

// // 1. Listen for Search Form Submission
// searchForm.addEventListener('submit', function (event) {
//   event.preventDefault(); // Prevent page reload

//   const query = searchInput.value.trim();

//   // 4. Ignore empty searches
//   if (!query) return;

//   fetchImages(query);
// });

// // 2. Fetch Data from API
// async function fetchImages(query) {
//   // Clear previous results before rendering new ones
//   resultsContainer.innerHTML = '';

//   if (statusElement) {
//     statusElement.textContent = `Searching for "${query}"...`;
//   }

//   // Build Wikimedia Commons API URL
//   const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|size|extmetadata&format=json&origin=*`;

//   try {
//     const response = await fetch(endpoint);

//     // Check response status
//     if (!response.ok) {
//       if (statusElement) statusElement.textContent = 'Failed to fetch images.';
//       return;
//     }

//     const data = await response.json();

//     if (!data.query || !data.query.pages) {
//       if (statusElement) statusElement.textContent = `No results found for "${query}".`;
//       return;
//     }

//     const pages = Object.values(data.query.pages);

//     // Update result count placeholder (Enhancement)
//     if (statusElement) {
//       statusElement.textContent = `Showing ${pages.length} results for "${query}"`;
//     }

//     // 3. Render Results
//     renderResults(pages);
//   } catch (error) {
//     if (statusElement) statusElement.textContent = 'Error loading results.';
//   }
// }

// // 3. Render Image Cards into Grid
// function renderResults(items) {
//   items.forEach((item) => {
//     const imageInfo = item.imageinfo ? item.imageinfo[0] : null;

//     if (imageInfo && imageInfo.url) {
//       // Create card element
//       const card = document.createElement('div');
//       card.classList.add('card');

//       // Create image element
//       const img = document.createElement('img');
//       img.src = imageInfo.url;
//       img.alt = item.title || 'Search result image';
//       img.loading = 'lazy';

//       // Create caption element
//       const caption = document.createElement('p');
//       caption.classList.add('card-title');
//       // Clean up "File:" prefix from Wikimedia titles
//       caption.textContent = item.title.replace('File:', '');

//       // Enhancement: Make card open full image in a new tab
//       const link = document.createElement('a');
//       link.href = imageInfo.url;
//       link.target = '_blank';
//       link.rel = 'noopener noreferrer';
//       link.appendChild(img);

//       // Append elements
//       card.appendChild(link);
//       card.appendChild(caption);
//       resultsContainer.appendChild(card);
//     }
//   });
// }

// // Enhancement: Wire up category / quick-pick chips
// if (categoryChips) {
//   categoryChips.forEach((chip) => {
//     chip.addEventListener('click', () => {
//       const topic = chip.textContent.trim();
//       searchInput.value = topic;
//       fetchImages(topic);
//     });
//   });
// }

// // Clear button functionality
// if (clearBtn) {
//   clearBtn.addEventListener('click', () => {
//     searchInput.value = '';
//     resultsContainer.innerHTML = '';
//     if (statusElement) statusElement.textContent = '';
//   });
// }


// for part 3 of project
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const statusElement = document.getElementById('status');
const loaderElement = document.getElementById('loader');
const categoryChips = document.querySelectorAll('.chip');
const clearBtn = document.getElementById('clear-btn');

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (!query) return;

  fetchImages(query);
});

async function fetchImages(query) {
  resultsContainer.innerHTML = '';
  if (statusElement) statusElement.textContent = '';

  showLoader(true);

  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|size|extmetadata&format=json&origin=*`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.query || !data.query.pages) {
      if (statusElement) {
        statusElement.textContent = `No results found for "${query}". Try another search!`;
      }
      return;
    }

    const pages = Object.values(data.query.pages);

    if (statusElement) {
      statusElement.textContent = `Showing ${pages.length} results for "${query}"`;
    }

    renderResults(pages);
  } catch (error) {
    if (statusElement) {
      statusElement.textContent = 'Something went wrong. Please check your connection and try again.';
    }
  } finally {
    showLoader(false);
  }
}

function renderResults(items) {
  items.forEach((item) => {
    const imageInfo = item.imageinfo ? item.imageinfo[0] : null;

    if (imageInfo && imageInfo.url) {
      const card = document.createElement('div');
      card.classList.add('card', 'fade-in');

      const img = document.createElement('img');
      img.src = imageInfo.url;
      img.alt = item.title || 'Search result image';
      img.loading = 'lazy';

      const caption = document.createElement('p');
      caption.classList.add('card-title');
      caption.textContent = item.title.replace('File:', '');

      const link = document.createElement('a');
      link.href = imageInfo.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.appendChild(img);

      card.appendChild(link);
      card.appendChild(caption);
      resultsContainer.appendChild(card);
    }
  });
}

function showLoader(isLoading) {
  if (loaderElement) {
    if (isLoading) {
      loaderElement.classList.remove('hidden');
    } else {
      loaderElement.classList.add('hidden');
    }
  }
}

if (categoryChips) {
  categoryChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const topic = chip.textContent.trim();
      searchInput.value = topic;
      fetchImages(topic);
    });
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    resultsContainer.innerHTML = '';
    if (statusElement) statusElement.textContent = '';
  });
}
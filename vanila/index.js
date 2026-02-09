const app = document.getElementById('app');

const router = {
    async navigate(page, params ) {
        app.innerHTML = '<p>Loading...</p>'; 
        
        if (page === 'home') {
            const articles = await getNews();
            renderHome(articles);
        } else if (page === 'details') {
            renderDetails(params);
        } else if (page === 'create') {
            renderCreate();
        }
    }
};

async function getNews() {
    const cached = localStorage.getItem('news_cache');
    if (cached) return JSON.parse(cached);

    try {
        const res = await fetch(`https://newsapi.org/v2/top-headlines?country=il&apiKey=${API_KEY}`);
        const data = await res.json();
        localStorage.setItem('news_cache', JSON.stringify(data.articles));
        return data.articles;
    } catch (err) {
        return [];
    }
}

function renderHome(articles) {
    app.innerHTML = `<div id="news-grid"></div>`;
    const grid = document.getElementById('news-grid');
    
    articles.forEach(art => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${art.urlToImage || 'https://via.placeholder.com/300'}" alt="news">
            <div class="card-content">
                <h3>${art.title}</h3>
                <small>${art.author || 'system'}</small>
            </div>
        `;
        card.onclick = () => router.navigate('details', art);
        grid.appendChild(card);
    });
}

function renderDetails(art) {
    app.innerHTML = `
        <div class="details">
            <button onclick="router.navigate('home')">→ back</button>
            <h1>${art.title}</h1>
            <img src="${art.urlToImage}" style="max-width:100%">
            <p><strong>Description:</strong> ${art.description || ''}</p>
            <p>${art.content || 'There is no additional content to display.'}</p>
        </div>
    `;
}

function renderCreate() {
    app.innerHTML = `
        <div class="form-container">
            <h2>Create a new article</h2>
            <form id="news-form">
                <input type="text" id="title" placeholder="title" required>
                <input type="text" id="author" placeholder="The name of the reporter" required>
                <input type="url" id="imgUrl" placeholder="Link to image">
                <textarea id="content" placeholder="Article content"rows="5"></textarea>
                <button  type="submit">Publish an article</button>
            </form>
        </div>
    `;

    document.getElementById('news-form').onsubmit = (e) => {
        e.preventDefault();
        const newArt = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            urlToImage: document.getElementById('imgUrl').value,
            content: document.getElementById('content').value
        };
        
        const currentNews = JSON.parse(localStorage.getItem('news_cache') || "[]");
        localStorage.setItem('news_cache', JSON.stringify([newArt, ...currentNews]));
        
        alert('The article was published successfully!');
        router.navigate('home');
    };
}

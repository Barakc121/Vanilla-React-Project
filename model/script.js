const app = document.getElementById('app');

const router = {
    // פונקציה לניווט בין דפים
    async navigate(page, params = null) {
        app.innerHTML = '<p>טוען...</p>'; // Loading state
        
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

// ניהול נתונים ו-Caching
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

// קומפוננטת דף הבית
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
                <small>${art.author || 'מערכת'}</small>
            </div>
        `;
        card.onclick = () => router.navigate('details', art);
        grid.appendChild(card);
    });
}

// קומפוננטת דף מורחב
function renderDetails(art) {
    app.innerHTML = `
        <div class="details">
            <button onclick="router.navigate('home')">→ חזרה</button>
            <h1>${art.title}</h1>
            <img src="${art.urlToImage}" style="max-width:100%">
            <p><strong>תיאור:</strong> ${art.description || ''}</p>
            <p>${art.content || 'אין תוכן נוסף להצגה.'}</p>
        </div>
    `;
}

// קומפוננטת יצירת כתבה
function renderCreate() {
    app.innerHTML = `
        <div class="form-container">
            <h2>יצירת כתבה חדשה</h2>
            <form id="news-form">
                <input type="text" id="title" placeholder="כותרת" required>
                <input type="text" id="author" placeholder="שם הכתב" required>
                <input type="url" id="imgUrl" placeholder="לינק לתמונה">
                <textarea id="content" placeholder="תוכן הכתבה" rows="5"></textarea>
                <button type="submit">פרסם כתבה</button>
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
        
        // הוספה ל-LocalStorage (לפני הקיים)
        const currentNews = JSON.parse(localStorage.getItem('news_cache') || "[]");
        localStorage.setItem('news_cache', JSON.stringify([newArt, ...currentNews]));
        
        alert('הכתבה פורסמה בהצלחה!');
        router.navigate('home');
    };
}

// טעינה ראשונית
router.navigate('home');
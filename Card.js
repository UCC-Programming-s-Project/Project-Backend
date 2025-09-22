
class ResultCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        const imageUrl = this.getAttribute('image-url');
        const synopsis = this.getAttribute('synopsis');
        const score = this.getAttribute('score');
        const truncatedSynopsis = synopsis.length > 100 ? `${synopsis.substring(0, 100)}...` : synopsis;

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background-color: #242424;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                }

                .card-image {
                    width: 100%;
                    height: 400px;
                    object-fit: cover;
                }

                .card-content {
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }

                .card h3 {
                    margin-bottom: 0.5rem;
                    font-size: 1.25rem;
                }

                .card .score {
                    background-color: #6c63ff;
                    color: #fff;
                    padding: 0.25rem 0.5rem;
                    border-radius: 5px;
                    font-weight: 700;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }

                .card p {
                    flex-grow: 1;
                    font-size: 0.9rem;
                    color: #ccc;
                }

                .read-more {
                    color: #6c63ff;
                    cursor: pointer;
                    text-decoration: none;
                    font-weight: 700;
                    align-self: flex-start;
                }

                .read-more:hover {
                    text-decoration: underline;
                }
            </style>
            <div class="card">
                <img src="${imageUrl}" alt="${title}" class="card-image">
                <div class="card-content">
                    <h3>${title}</h3>
                    <p class="synopsis">${truncatedSynopsis}</p>
                    ${synopsis.length > 100 ? '<a class="read-more">Read more</a>' : ''}
                </div>
                ${score ? `<div class="score">${score}</div>` : ''}
            </div>
        `;

        const readMoreLink = this.shadowRoot.querySelector('.read-more');
        if (readMoreLink) {
            readMoreLink.addEventListener('click', (e) => {
                e.preventDefault();
                const synopsisElement = this.shadowRoot.querySelector('.synopsis');
                if (readMoreLink.textContent === 'Read more') {
                    synopsisElement.textContent = synopsis;
                    readMoreLink.textContent = 'Read less';
                } else {
                    synopsisElement.textContent = truncatedSynopsis;
                    readMoreLink.textContent = 'Read more';
                }
            });
        }
    }
}

customElements.define('result-card', ResultCard);

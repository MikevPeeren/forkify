import {
    elements
} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
    elements.searchResultsPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));

    resultsArray.forEach(element => {
        element.classList.remove('results__link--active');
    }); 

    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }

            return accumulator + current.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }

    return title;
}

export const renderRecipe = item => {
    const markup =
        `
    <li>
        <a class="results__link" href="#${item.recipe.uri}">
            <figure class="results__fig">
                <img src="${item.recipe.image}" alt="${item.recipe.label}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(item.recipe.label)}</h4>
                <p class="results__author">${item.recipe.source}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

// Type is 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // Only Button to go to Next Page.
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both Buttons.
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only Button to go to Prev Page.
        button = createButton(page, 'prev');
    } else {
        return
    }

    elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    if ('undefined' !== typeof recipes) {
        recipes.slice(start, end).forEach(renderRecipe);
        renderButtons(page, recipes.length, resPerPage);
    }
};
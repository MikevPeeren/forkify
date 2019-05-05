import {
    elements
} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
}

const limitRecipeTitle = (title, limit = 17) => {
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

const renderRecipe = item => {
    const markup =
        `
    <li>
        <a class="results__link" href="${item.recipe.url}">
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

export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
};
import {
    elements,
    renderLoader,
    clearLoader,
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Search from './models/Search';
import Recipe from './models/Recipe';

/**
 * Global State of the App
 * - Search Object
 * - Current Recipe Object
 * - Shopping List Object
 * - Liked Recipes
 */
const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
    // 1. Get Query from View.
    const query = searchView.getInput();

    if (query) {
        // 2. New Search Object and add to State.
        state.search = new Search(query);

        // 3. Prepare UI for Results
        renderLoader(elements.searchResults);
        searchView.clearResults();
        searchView.clearInput();

        try {
            // 4. Search for Recipes
            await state.search.getResults();

            // 5. Render Results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log('Could not get any Recipes.');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultsPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
    // Get ID from Url
    const id = window.location.hash.replace('#', '');

    if (id) {
        const encodedID = encodeURIComponent(id);
        // Prepare UI for changes.
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search Item.
        if(state.search) searchView.highlightSelected(id);

        // Create new Recipe Object.
        state.recipe = new Recipe(encodedID);

        try {
            // Get Recipe Data and parse Ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate Servings and Time.
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render Recipe.
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            clearLoader();
            recipeView.clearRecipe();
            console.log('Error Processing Recipe!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
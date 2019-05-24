import {
    elements,
    renderLoader,
    clearLoader,
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';

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
        if (state.search) searchView.highlightSelected(id);

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

/**
 * List Controller
 */
const controlList = () => {
    // Create a new list IF there is none yet.
    if (!state.list) state.list = new List();

    // Add each Ingredient to the List and UI.
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        listView.renderItem(item);
    });
};

// Handle Delete and Update List item Events.
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the Delete Button.
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from State.
        state.list.deleteItem(id);

        // Delete from UI.
        listView.deleteItem(id);
    } // Handle Count update
    else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id.value);
    }
});

// Handling Recipe Button Clicks.
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease Button is Clicked.
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase Button is Clicked.
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    }
});
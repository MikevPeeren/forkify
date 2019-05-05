import {
    elements,
    renderLoader,
    clearLoader,
} from './views/base';
import * as searchView from './views/searchView';
import Search from './models/Search';

/**
 * Global State of the App
 * - Search Object
 * - Current Recipe Object
 * - Shopping List Object
 * - Liked Recipes
 */
const state = {};

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

        // 4. Search for Recipes
        await state.search.getResults();

        // 5. Render Results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
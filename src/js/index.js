import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements } from "./views/base";
//global state of the app (a.k.a. central warehouse)
// - Search object
// - Current recipe object
// - Shopping list object
// - liked recipes
const state = {};

// action when user click on "search"
const controlSearch = async () => {
	// 1) get query from view
	const query = searchView.getInput();

	if (query) {
		// 2) New search object and add to state
		// new instance based on Search class
		state.search = new Search(query);

    // 3) Prepare UI for results
    //clear input field
    searchView.clearInput();
    //clear recipe results to make space for new results
		searchView.clearResults();

		// 4) Search for recipes
		await state.search.getResults();

		// 5) render results on UI
		searchView.renderResults(state.search.result);
	}
};

//When users click on "search"
elements.searchForm.addEventListener("submit", (e) => {
	// stops default reloading when search is clicked
	e.preventDefault();
	controlSearch();
});

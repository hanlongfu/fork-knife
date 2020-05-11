import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
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
		//render loader
		renderLoader(elements.searchRes);

		// 4) Search for recipes
		await state.search.getResults();

		// 5) render results on UI
		//clear loader
		clearLoader();
		searchView.renderResults(state.search.result);
	}
};

//When users click on "search"
elements.searchForm.addEventListener("submit", (e) => {
	// stops default reloading when search is clicked
	e.preventDefault();
	controlSearch();
});

//event listener to click event on pagination button
elements.searchResPages.addEventListener("click", (e) => {
	//we are only interested in the class 'btn-inline'
	//no matter where I click, we only get '.btn-inline'
	//because we want to use 'data-goto' property
	const btn = e.target.closest(".btn-inline");
	if (btn) {
		//dataset.goto reads data-goto
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});

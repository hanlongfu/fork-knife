import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";
//global state of the app (a.k.a. central warehouse)
// - Search object
// - Current recipe object
// - Shopping list object
// - liked recipes
const state = {};

/*---------SEARCH CONTROLLER-----------*/
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
		try {
			// 4) Search for recipes
			await state.search.getResults();

			// 5) render results on UI
			//clear loader
			clearLoader();
			searchView.renderResults(state.search.result);
		} catch (e) {
			alert("Something wrong with the search...");
			clearLoader();
		}
	}
};

//When users click on "search"
elements.searchForm.addEventListener("submit", (e) => {
	// stops default reloading when search is clicked
	e.preventDefault();
	controlSearch();
});

//event listener to click event on pagination button
//using event delegation
elements.searchResPages.addEventListener("click", (e) => {
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

/*---------RECIPE CONTROLLER-----------*/
const controlRecipe = async () => {
	//this gets the hash of the url
	const id = window.location.hash.replace("#", "");
	console.log(id);

	if (id) {
		// prepare UI for changes

		// create new instance object of Recipe class
		// set it as the recipe property of the state object
		state.recipe = new Recipe(id);

		try {
			// get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			// calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			// render recipe
			console.log(state.recipe);
		} catch (e) {
			alert("Error processing recipe!");
		}
	}
};

//listen to event triggerd by hash change
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
["hashchange", "load"].forEach((event) =>
	window.addEventListener(event, controlRecipe)
);

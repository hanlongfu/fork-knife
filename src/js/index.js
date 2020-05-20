import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

//global state of the app (a.k.a. central warehouse)
// the state objec contains the following
// - Search object
// - Current recipe object
// - Shopping list object
// - liked recipes

// react and redux are used to manage state
const state = {};

/*---------SEARCH CONTROLLER-----------*/
// what happens when user click on "search"
// for testing
window.search = state;
const controlSearch = async () => {
	
	// 1) get query from the View
	const query = searchView.getInput();
	//only if query exists
	if (query) {
		// 2) New search object and add to state
		// new instance based on Search class
		// stored as property of state object
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
			 // 5.1) clear loader first
			clearLoader();
			 // 5.2) render results
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
	//console.log(id);

	if (id) {
		// prepare UI for changes
		recipeView.clearRecipe(); // clear existing recipe
		renderLoader(elements.recipe); //renderLoader(parentElement)

		//highlight selected search item
		if (state.search) searchView.highlightSelected(id);

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
			clearLoader();
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
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

/* ----------LIST CONTROLLER------------*/
const controlList = () => {
	//create a new list if there is none yet
	if (!state.list) state.list = new List();

	//add each ingredient to the list and UI
	state.recipe.ingredients.forEach((el) => {
		//add to the list
		const item = state.list.addItem(el.count, el.unit, el.ingredient);

		//render the list
		listView.renderItem(item);
	});
};

/*-------------LIKE CONTROLLER ---------*/
state.likes = new Likes();
const controlLike = () => {
	if (!state.likes) state.likes = new Likes();
	const currentID = state.recipe.id;

	// User has not yet liked current recipe
	if (!state.likes.isLiked(currentID)) {
		// Add like to the state
		const newLike = state.likes.addLikes(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
		);

		// Toggle the like button
		likesView.toggleLikeBtn(true);
		// Add like to the UI list
		likesView.renderLikes(newLike);
		console.log(state.likes);

		// User has liked current recipe
	} else {
		// remomve like to the state
		state.likes.deleteLike(currentID);
		// Toggle the like button
		likesView.toggleLikeBtn(false);
		// Remove like to the UI list
		likesView.deleteLike(currentID);
		console.log(state.likes);
	}
	likesView.toggleLikeMenu(state.likes.getNumLikes())
};

// handle delete and update list events
elements.shopping.addEventListener("click", (e) => {
	const id = e.target.closest(".shopping__item").dataset.itemid;

	//handle the delete button
	if (e.target.matches(".shopping__delete, .shopping__delete *")) {
		// delete from state
		state.list.deleteItem(id);

		// delete from UI
		listView.deleteItem(id);

		//handle count update
	} else if (e.target.matches(".shopping__count-value")) {
		const val = parseFloat(e.target.value);
		state.list.updateCount(id, val);
	}
});


// Restore liked recipes on page load
window.addEventListener('load', ()=> {
	state.likes = new Likes();
	
	//restore likes from localStorage
	state.likes.readStorage();
	
	// toggle like menu button
	likesView.toggleLikeMenu(state.likes.getNumLikes());

	// Render the existing likes
	state.likes.likes.forEach(like => likesView.renderLikes(like));
});

//Handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
	// * represents any child in css selector
	if (e.target.matches(".btn-decrease,.btn-decrease *")) {
		if (state.recipe.servings > 1) {
			// Decrease button is clicked
			state.recipe.updateServings("dec");
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches(".btn-increase, .btn-increase *")) {
		// increase button is clicked
		state.recipe.updateServings("inc");
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
		// add ingredients to shoppiing list
		controlList();
	} else if (e.target.matches(".recipe__love, .recipe__love * ")) {
		// Like Controller
		controlLike();
	}
});

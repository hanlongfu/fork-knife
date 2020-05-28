import axios from "axios";
/*********************************** 
  SEARCH MODEL
***********************************/
class Search {
	constructor(query) {
		this.query = query;
	}
	getResults() {
		try {
			const res = axios(
				`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
			);
			this.result = res.data.recipes;
		} catch (e) {
			alert(e);
		}
	}
}

/********************************** 
	SEARCH VIEW
***********************************/
const getInput = () => document.querySelector(".search__field").value;
const clearInput = () => {
	document.querySelector(".search__field").value = "";
};
const clearResults = () => {
	document.querySelector("results__list").innerHTML = "";
};

/* --------- Recipe Results ----------*/
// limit title to 17 characters
const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	if (title.length > limit) {
		title.split(" ").reduce((acc, curr) => {
			if (acc + curr.length <= limit) {
				newTitle.push(curr);
			}
			//update the accumulator
			return acc + curr.length;
		}, 0);

		//return the result
		return `${newTitle.join(" ")}...`;
	}
	return title;
};

// Recipe is individual recipe item
const renderRecipe = (recipe) => {
	const markeup = `
		<li>
			<a class="results__link results__link--active" href="${recipe.recipe_id}">
					<figure class="results__fig">
							<img src="${recipe.image_url}" alt=${limitRecipleTitle(recipe.title)}>
					</figure>
					<div class="results__data">
							<h4 class="results__name">${limitRecipleTitle(recipe.title)}</h4>
							<p class="results__author">${recipe.publisher}</p>
					</div>
			</a>
		</li>
	`;
	document
		.querySelector("results__list")
		.insertAdjacentHTML("beforeend", markup);
};

// Results are the aggregate
// page is defaulted to first page, results per page are defaulted to 10 per page
const renderResults = (recipes, page = 1, resPerPage = 10) => {
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;

	//slice off the first ten items (0 - 9)
	recipes.slice(start, end).forEach(renderRecipe);
};

/* --------- Loader ----------*/
const renderLoader = (parent) => {
	//loader markup
	const loader = `
		<div class='loader'>
			<svg>	
				<use href="img/icons.svg#icon-cw"></use>
			</svg>
		</div>
	`;
	parent.insertAdjacentHTML("afterbegin", loader);
};
const clearLoader = () => {
	const loader = document.querySelector(".loader");
	//if there is a loader, remove the loader;
	if (loader) loader.parentElement.removeChild(loader);
};

/********************************** 
  Global Controller
***********************************/
// initiate a state object to store everything
const state = {};
const controlSearch = async () => {
	//obtain query
	const query = getInput();
	// console.log(query);
	if (query) {
		// 2) store search query as a property of state
		state.search = new Search(query);
		// 3) prepare UI for results
		clearInput();
		clearResults();
		renderLoader(document.querySelector(".results"));
		// 4) search for recipes
		await state.search.getResults();

		// 5) render results on UI
		clearLoader(); // clear loader as soon as results come back
		renderResults(state.search.result);
	}
};

document.querySelector(".search").addEventListener("submit", (e) => {
	e.preventDefault();
	e.controlSearch();
});

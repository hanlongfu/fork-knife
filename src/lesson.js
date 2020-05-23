import axios from "axios";
/*
  SEARCH MODEL
*/
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

/*
	SEARCH VIEW
*/
const getInput = () => document.querySelector(".search__field").value;
const clearInput = () => {
	document.querySelector(".search__field").value = "";
};
const clearResults = () => {
	document.querySelector("results__list").innerHTML = "";
};

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

const renderRecipe = (recipe) => {
	const markeup = `
		<li>
			<a class="results__link results__link--active" href="${recipe.recipe_ida}">
					<figure class="results__fig">
							<img src="${recipe.image_url}" alt="Test">
					</figure>
					<div class="results__data">
							<h4 class="results__name">${recipe.title}</h4>
							<p class="results__author">${recipe.publisher}</p>
					</div>
			</a>
		</li>
	`;
	document
		.querySelector("results__list")
		.insertAdjacentHTML("beforeend", markup);
};

const renderResults = (recipes) => {
	recipes.forEach(renderRecipe);
};

/*
  Global Controller
*/
// initiate a state object to store everything
const state = {};
const controlSearch = async () => {
	//obtain query
	const query = getInput();
	// console.log(query);
	if (query) {
		// store search query as a property of state
		state.search = new Search(query);
		// prepare UI for results
		clearInput();
		clearResults();
		// search for recipes
		await state.search.getResults();
		// render results on UI
		renderResults(state.search.result);
	}
};

document.querySelector(".search").addEventListener("submit", (e) => {
	e.preventDefault();
	e.controlSearch();
});

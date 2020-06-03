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

class Recipe {
	constructor(id) {
		this.id = id;
	}
	async getRecipe() {
		try {
			const res = await axios(
				`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
			);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.img_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
		} catch (error) {
			console.log(error);
			alert("something went wrong!");
		}
	}

	calcTime() {
		const numImg = this.ingredients.length;
		const periods = Math.ceil(numImg / 3);
		this.time = periods * 15;
	}

	calcServings() {
		this.servings = 4;
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
	document.querySelector(".results__pages").innerHTML = "";
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

/* --------- Pagination buttons ----------*/
//create the button markup
// type：prev, next
const createButton = (page, type) => `
	<button class="btn-inline results__btn--${type}" data-goto=${
	type === "prev" ? page - 1 : page + 1
} >
		<svg class="search__icon">
				<use href="img/icons.svg#icon-triangle-${
					type === "prev" ? "left" : "right"
				}"></use>
		</svg>
		<span>Page ${type === "prev" ? page - 1 : page + 1} </span>
	</button>
`;

const renderButtons = (page, numResults, resPerPage) => {
	//round up to the ceiling
	const pages = Math.ceil(numResults / resPerPage);

	let button;
	//calculate the button position
	if (page === 1 && pages > 1) {
		//button to go to next page if on the first page
		button = createButton(page, "next");
	} else if (page < pages) {
		//prev and next button if in the middle
		button = `
		 ${createButton(page, "prev")}
		 ${createButton(page, "next")}
		`;
	} else if (page === pages && pages > 1) {
		//button to go to prev page if on the last page
		button = createButton(page, "prev");
	}
	document
		.querySelector(".results__pages")
		.insertAdjacentHTML("afterbegin", button);
};

// Results are the aggregate
// page is defaulted to first page, results per page are defaulted to 10 per page
const renderResults = (recipes, page = 1, resPerPage = 10) => {
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;

	//slice off the first ten items (0 - 9)
	recipes.slice(start, end).forEach(renderRecipe);

	//render pagination buttons
	renderButtons(page, recipes.length, resPerPage);
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
  Recipe Controller
***********************************/
const controlRecipe = async () => {
	// get ID from url
	const id = window.location.hash.replace("#", "");

	if (id) {
		// prepare UI for changes
		// create new recipe object
		state.recipe = new Recipe(id);
		// get recipe data
		await state.recipe.getRecipe();
		// calculate servings and time
		state.recipe.calcTime();
		state.recipe.calcTime();
		// render recipe
		console.log(state.recipe);
	}
};

//hash change event
window.addEventListener("hashchange", controlRecipe);

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

document.querySelector(".results__pages").addEventListener("click", (e) => {
	// use event delegation
	// closest returns the closest ancestor of the current element which matches
	// the selectors given in parameter
	const btn = e.target.closest(".btn-inline");
	if (btn) {
		let goToPage = parseInt(btn.dataset.goto, 10);
		clearResults();
		renderResults(state.search.result, goToPage);
	}
});

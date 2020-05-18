import { elements } from "./base";

//obtain input value of the search field
export const getInput = () => elements.searchInput.value;

//clear input field before and after search
export const clearInput = () => {
	elements.searchInput.value = "";
};

//highlight selected search recipe item
export const highlightSelected = (id) => {
	//select search items and turn them into array
	const resultsArr = Array.from(document.querySelectorAll(".results__link"));
	//remove highlight from already selected item
	resultsArr.forEach((el) => el.classList.remove("results__link--active"));
	document
		.querySelector(`.results__link[href="#${id}"]`)
		.classList.add("results__link--active");
};

//clear results (including pagination button) to make space for new results
export const clearResults = () => {
	elements.searchResList.innerHTML = "";
	//pagination buttons
	elements.searchResPages.innerHTML = "";
};

// limit the reciple title to 17 characters
export const limitRecipeTitle = (title, limit = 17) => {
	//create an empty array to hold the new title
	const newTitle = [];
	if (title.length > limit) {
		//title split into an array of words
		title.split(" ").reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);

		//return the result
		return `${newTitle.join(" ")}...`;
	}
	return title;
};

//render individual recipe result on UI
//each recipe object has the following properties
// f2f_url, image_url, publisher, publisher_url, recipe_id, social rank, title, source_url
const renderRecipe = (recipe) => {
	const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${limitRecipeTitle(
		recipe.title
	)}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
  `;
	//insert markup under ul with class name ".results__list"
	elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

/*
  create pagination button
*/

//type: 'prev' or 'next'
// ${type === 'prev' ? page - 1: page + 1}  ==> this displays the number on the pagination button
// 'data-goto' allows us to know which page to go to when clicked
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto = ${
	type === "prev" ? page - 1 : page + 1
}>
		<span>Page ${type === "prev" ? page - 1 : page + 1}</span>			
		<svg class="search__icon">
						<use href="img/icons.svg#icon-triangle-${
							type === "prev" ? "left" : "right"
						}"></use>
		</svg>
      
  </button>
`;

// render backward and forward pagination buttons
const renderButtons = (page, numResults, resPerPage) => {
	// 4.5 pages -> 5 pages
	const pages = Math.ceil(numResults / resPerPage);

	let button;
	// page 1: only display forward button to page 2
	if (page === 1 && pages > 1) {
		button = createButton(page, "next");
		// in-between page: display both backward and forward button
	} else if (page < pages) {
		button = `
      ${createButton(page, "prev")}
      ${createButton(page, "next")}
    `;
		// last page: only display backward button (results- resPerPage)
	} else if (page === pages && pages > 1) {
		button = createButton(page, "prev");
	}

	elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

//render recipe search results including pagination on UI
//set the default position as page 1, each page has 10 results
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	//render results of current page
	//set the starting and ending point
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;

	// not including the end
	recipes.slice(start, end).forEach(renderRecipe);

	//render pagination buttons
	renderButtons(page, recipes.length, resPerPage);
};

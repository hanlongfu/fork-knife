//an object that contains all the selections of DOM elements
//this is similar to DOMstrings in Budgety app
export const elements = {
	searchForm: document.querySelector(".search"),
	searchInput: document.querySelector(".search__field"),
	searchResList: document.querySelector(".results__list"),
	searchRes: document.querySelector(".results"),
	searchResPages: document.querySelector(".results__pages"),
	recipe: document.querySelector('.recipe')
};

export const elementStrings = {
	loader: "loader",
};

// render loader that can be reused for loading results (in 2 different places)
export const renderLoader = (parent) => {
	const loader = `
		<div class="${elementStrings.loader}">
			<svg>
				<use href="img/icons.svg#icon-cw"></use>
			</svg>
		</div>
	`;
	parent.insertAdjacentHTML("afterbegin", loader);
};

//clear loader
export const clearLoader = () => {
	const loader = document.querySelector(`.${elementStrings.loader}`);
	if (loader) {
		// delete loader
		loader.parentElement.removeChild(loader);
	}
};

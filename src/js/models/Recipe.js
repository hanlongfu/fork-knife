import axios from "axios";
export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	//get individual recipes
	async getRecipe() {
		try {
			const res = await axios(
				`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
			);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
			console.log(res);
			//recipes data are stored inside result property
			this.result = res.data.recipes;
		} catch (e) {
			console.log(e);
			alert("Something went wrong!");
		}
	}

	// calculate cooking time
	calcTime() {
		// assume we need 15 min for each 3 ingredients
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}

	//calculate servings
	calcServings() {
		this.servings = 4;
	}

	//separate quantitity, unit, ingredients from ingredient list
	parseIngredients() {
		const unitsLong = [
			"tablespoons",
			"tablespoon",
			"ounces",
			"ounce",
			"teaspoons",
			"teaspoon",
			"cups",
			"pounds",
		];
		const unitShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "lb"];
		const newIngredients = this.ingredients.map((e) => {
			//1) uniform units
			let ingredient = e.toLowerCase();

			//replace elements in unitsLong with with corresponding elements in unitShort
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitShort[i]);
			});

			//2) remove parenthesis
			//google when you don't have the answer
			ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

			//3) parse ingredients into count, unit, and ingredient
			return ingredient;
		});
		this.ingredients = newIngredients;
	}
}

//ingredient list
// 0: "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled"
// 1: "1 3/4 (.44 ounce) teaspoons salt"
// 2: "1 teaspoon (.11 ounce) instant yeast"
// 3: "1/4 cup (2 ounces) olive oil (optional)"
// 4: "1 3/4 cups (14 ounces) water, ice cold (40F)"
// 5: "Semolina flour OR cornmeal for dusting"

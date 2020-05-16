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
			"pound",
			"kilograms",
			"kilogram",
			"grams",
			"gram",
		];
		const unitShort = [
			"tbsp",
			"tbsp",
			"oz",
			"oz",
			"tsp",
			"tsp",
			"cup",
			"lb",
			"lb",
			"kg",
			"kg",
			"g",
			"g",
		];
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
			//3.1) turn the each ingredient (string) into an array
			const arrIng = ingredient.split(" ");

			//3.2) find the index of the unit
			//"(el) => unitShort.includes(el)" returns true or false
			//findIndex will return the index of 'true'
			const unitIndex = arrIng.findIndex((el) => unitShort.includes(el));

			let objIng; //object ingredient
			// 3.3.1) there is a unit
			if (unitIndex > -1) {
				const arrCount = arrIng.slice(0, unitIndex);
				let count;
				// 4 cups, arrcount is [4]
				if (arrCount.length === 1) {
					//special case: 1-1/2
					count = eval(arrIng[0].replace("-", "+"));
				} else {
					// 4 1/2 cups, arrCount is [4, 1/2]
					count = eval(arrIng.slice(0, unitIndex).join("+"));
				}

				objIng = {
					count: count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(" "),
				};

				// 3.3.2) there is no unit, but 1st element is a number
				// if it is a number it can be parsed using parseInt.
			} else if (parseInt(arrIng[0], 10)) {
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: "",
					//entire array except the first element - slice(1)
					ingredient: arrIng.slice(1).join(" "),
				};

				// 3.3.3) there is no unit and no number
			} else if (unitIndex === -1) {
				objIng = {
					count: 1,
					unit: "",
					ingredient: ingredient,
				};
			}

			return objIng;
		});
		this.ingredients = newIngredients;
	}

	updateServings(type) {
		//servings
		const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

		//ingredients
		this.ingredients.forEach((ing) => {
			// old count * scaling factor
			ing.count *= newServings / this.servings;
		});
		this.servings = newServings;
	}
}

//ingredient list
// 0: "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled"
// 1: "1 3/4 (.44 ounce) teaspoons salt"
// 2: "1 teaspoon (.11 ounce) instant yeast"
// 3: "1/4 cup (2 ounces) olive oil (optional)"
// 4: "1 3/4 cups (14 ounces) water, ice cold (40F)"
// 5: "Semolina flour OR cornmeal for dusting"

import axios from "axios";

//search data model
export default class Search {
	constructor(query){
		this.query = query;
	}
	async getResults () {
		try{
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
	
			// res.data.recipes are data read back from the api
			this.result = res.data.recipes;
		} catch(e) {
			alert(e);
		}		
	}
}



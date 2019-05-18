import Axios from "axios";
import configClass from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await Axios(`${configClass.crossOrigin}${configClass.apiUrlSearch}?r=${this.id}&app_id=${configClass.apiID}&app_key=${configClass.apiKey}`);
            const resData = res.data[0];
            this.title = resData.label;
            this.author = 'Mike van Peeren';
            this.img = resData.image;
            this.url = resData.url;
            this.ingredients = resData.ingredients;
        } catch (error) {
            console.log('Something went wrong :(');
        }
    }

    calcTime(){
        // Assuming that we need 15 min for each 3 Ingredients.
        const numIng = this.ingredients.length;
        const periods = numIng / 3;
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }
}
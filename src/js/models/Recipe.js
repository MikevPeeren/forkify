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
            this.author = resData.source;
            this.img = resData.image;
            this.url = resData.url;
            this.ingredients = resData.ingredients;
        } catch (error) {
            console.log('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 Ingredients.
        const numIng = this.ingredients.length;
        const periods = numIng / 3;
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(element => {
            let ingredient = element["text"];
            // 1) Uniform Units
            ingredient = ingredient.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })

            // 2) Remove Parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            // 3) Parse Ingredients into Count, Unit and Ingredient.
            const arrayIngredient = ingredient.split(' ');
            const unitIndex = arrayIngredient.findIndex(element2 => units.includes(element2));

            let objectIngredient;
            if (unitIndex > -1) {
                // There is a Unit
                const arrayCount = arrayIngredient.slice(0, unitIndex);
                let count;
                if (arrayCount.length === 1) {
                    count = eval(arrayIngredient[0].replace('-', '+'));
                } else {
                    count = eval(arrayIngredient.slice(0, unitIndex).join('+'));
                }

                objectIngredient = {
                    count,
                    unit: arrayIngredient[unitIndex],
                    ingredient: arrayIngredient.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(arrayIngredient[0], 10)) {
                // There is NO Unit, but first element is a number.
                objectIngredient = {
                    count: parseInt(arrayIngredient[0], 10),
                    unit: '',
                    ingredient: arrayIngredient.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO Unit and NO number in first position
                objectIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objectIngredient;
        });
        this.ingredients = newIngredients;
    }
}
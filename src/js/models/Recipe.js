import axios from 'axios';
import { key, proxy} from '../config';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        }

        catch(error){
            console.log(error);
        }
    }

    calcTime(){
        //Assuming we need 15 min for each 3 ingredients
        const numbIngr = this.ingredients.length;
        const periods = Math.ceil(numbIngr/3);
        this.time = periods * 15;    
    
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const newIngredients = this.ingredients.map(el => {
            //uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            })
            //remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, "");
            //parse ingredients into count, unit and ingredient
            return ingredient;
        });
        this.ingredients = newIngredients;
    }
}
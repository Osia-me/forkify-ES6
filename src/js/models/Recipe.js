import axios from 'axios';
import { key, proxy} from '../config';
import { parse } from 'querystring';

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
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [... unitShort, 'kg', 'g'];
        
        const newIngredients = this.ingredients.map(el => {
            //uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            })
            //remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
            //parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIngredient;

            if(unitIndex > -1){
                //There is exist a unit
                //for example 4 1/2 cups, arrCount is [4, 1/2]
                //for example 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex); 
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    //[4, 1/2] ---> eval([4, 1/2]) ---> 4.5
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIngredient = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex +1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)){
                //There is NO unit, but 1st element is a number
                objIngredient = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1){
                //There is NO unit exist and NO number on 1st position
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIngredient;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //Serving
        const newServings = type === 'dec' ? this.servings - 1 : this.servings +1;
        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;

    }
}


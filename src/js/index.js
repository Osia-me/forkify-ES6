// // Global app controller
// //default
// import string from './models/Search';
// //named multiple things
// //import {add as a, multiply as m, ID} from './views/searchView';
// ///import all from the file
// import * as searchView from './views/searchView';

//API
//https://www.food2fork.com/api/search
//API Key: e073fa7812f8f49ab1078d85ffc844dc

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, displayLoader, clearLoader} from './views/base';

/*Global state of the app
*- Search object
*- Current recipe object
*- Liked recipes
*/
const state = {};

//Search controller
const controlSearch = async () => {
    //1. Get the query from the view
    const query = searchView.getInput();
    console.log(query);

    if(query){
        //2. New search object and add it to state
        state.search = new Search(query);

        //3. Prepare UI for result
        searchView.clearInput();
        searchView.clearResults();

        displayLoader(elements.searchResults);
        try {
            //4. Search for recipes
        await state.search.getResult();

        //5. Render results on UI
        clearLoader();
        searchView.displayResults(state.search.recipe);
        } catch (error) {
            console.log(error);
            clearLoader();
        }
        
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResults.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.displayResults(state.search.recipe, goToPage);
    }
});

//Recipe controller
const controlRecipe = async () => {
    //Get id of recipe from url
    const id = window.location.hash.replace('#', '');
    if(id){
        //prepare ui for changes
        //create new recipe object
        state.recipe = new Recipe(id);

        try{
            //get recipe data and parse ingredients
        await state.recipe.getRecipe();
        //parse ingredients
        state.recipe.parseIngredients();
        //calcultate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        //display recipe
        console.log(state.recipe);
        } catch(error){
            alert(`Error processing recipe: ${error}`);
        }
        
    }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
//same but in one line
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

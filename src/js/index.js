// // Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import {elements, displayLoader, clearLoader} from './views/base';

/*Global state of the app
*- Search object
*- Current recipe object
*- Liked recipes
*/
const state = {};
window.state = state;

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
        recipeView.clearRecipe();
        displayLoader(elements.recipe);

        //Highlight the selected item
        if(state.search) searchView.highlightSeleted(id);
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
        clearLoader();
        recipeView.displayRecipe(state.recipe);

        } catch(error){
            alert(`Error processing recipe: ${error}`);
        }
        
    }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
//same but in one line
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//LIST CONTROLLER
const constolList = () => {
    //Create new list if there is none yet
    if(!state.list) state.list = new List();

    //add ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.displayItem(item);
    });
};

//Handle delete and update list item events
elements.shoppingList.addEventListener('click', event => {
    const id = event.target.closest('.shoppingItem').dataset.id;
    console.log(event.target.closest('.shoppingItem'));
    //Handle delete btn
    if (event.target.matches('.shoppingDelete, .shoppingDelete *')){
        //Delete from state
        console.log("Deleted");
        state.list.deleteItem(id);
        //Delete from  UI
        listView.deleteItem(id);

    //Handle the count update
    } else if (event.target.matches('.shoppingCount-value')){
        const val = parseFloat(event.target.value, 10);
        state.list.updateCount(id, val);
    }
});


//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if( e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipeBtn-add, .recipeBtn-add *')){
        constolList();
    }

});


window.l = new List();
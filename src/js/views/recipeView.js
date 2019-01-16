import {elements} from './base';
import {Fraction} from 'fractional';

export const clearRecipe = () => {
    elements.recipe.innerHTML = ''
};

const formatCount = count => {
    if(count){


        const newCount = Math.round(count * 10000) / 10000;
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));

        if(!dec) return newCount;

        //if count 0.5 ---> 1/2
        if(int === 0){
            const fr = new Fraction(newCount);
            return `${fr.numerator}/${fr.denominator}`;
        } else {
        //count 3.5 ---> 3 1/2
            const fr = new Fraction(newCount - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }


    }

    return '?';
};

const createIngr = ingredient => `
    <li class="recipeItem">
        <svg class="recipeIcon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipeCount">${formatCount(ingredient.count)}</div>
        <div class="recipeIngredient">
        <span class="recipeUnit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;
export const displayRecipe = (recipe, isLiked) => {
    const markUp = `
        <figure class="recipeFig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipeImg">
            <h1 class="recipeTitle">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipeDetails">
            <div class="recipeInfo">
                <svg class="recipeInfo-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipeInfo-data recipeInfo-data-minutes">${recipe.time}</span>
                <span class="recipeInfo-text"> minutes</span>
            </div>
            <div class="recipeInfo">
                <svg class="recipeInfo-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipeInfo-data recipeInfo-data-people">${recipe.servings}</span>
                <span class="recipeInfo-text"> servings</span>


                <div class="recipeInfo-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>
            </div>
            <button class="recipeLove">
                <svg class="headerLikes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>



        <div class="recipeIngredients">
            <ul class="recipeIngredient-list">
                
                ${recipe.ingredients.map(el => createIngr(el)).join('')}
            
                

               
            <button class="btn-small recipeBtn recipeBtn-add">
                <svg class="searchIcon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipeDirections">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipeDirections-text">
                This recipe was carefully designed and tested by
                <span class="recipeBy">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipeBtn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="searchIcon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', markUp);
};

export const updateServingsIngredients = recipe => {
    //update servings
    document.querySelector('.recipeInfo-data-people').textContent = recipe.servings;
    
    //update ingredients
    const countElements = Array.from(document.querySelectorAll('.recipeCount'));
    countElements.forEach((el, ind) => {
        el.textContent = formatCount(recipe.ingredients[ind].count);
    });

};
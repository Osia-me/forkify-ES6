import {elements} from './base';
import { updateServingsIngredients } from './recipeView';

export const displayItem = item => {
    const markUp = `
    <li class="shoppingItem data-itemid = ${item.id}">
        <div class="shoppingCount">
            <input type="number" value="${item.count}" step="${item.count}" class = "shoppingCount-value">
            <p>${item.unit}</p>
        </div>
        <p class="shoppingDescription">${item.ingredient}</p>
        <button class="shoppingDelete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    
    `;
    elements.shoppingList.insertAdjacentHTML('beforeend', markUp);
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
};
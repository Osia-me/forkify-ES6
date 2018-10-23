// export const add = (a, b) => a + b;
// export const multiply = (a, b) => a * b;
// export const ID = 23;
import {elements} from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = "";
    elements.searchResPages.innerHTML = "";
};

export const highlightSeleted = id => {
    const resultsArr = Array.from(document.querySelectorAll('.resultsLink'));
    resultsArr.forEach(el => {
        el.classList.remove('resultsLink--active');
    })
    document.querySelector(`a[href="#${id}"]`).classList.add('resultsLink--active');
}

const limitRecipeTitle = (title, limit=17) => {
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((accum, curre) => {
            if(accum + curre.length <= limit){
                newTitle.push(curre);
            }
            return accum + curre.length;
        }, 0);
        
        //return result
        return `${newTitle.join(' ')}...`;
    }
    return title;
};

const displayRecipe = recipe => {
    const markup = `
    <li>
        <a class="resultsLink" href="#${recipe.recipe_id}">
            <figure class="resultsFig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="resultsData">
                <h4 class="resultsName">${limitRecipeTitle(recipe.title)}</h4>
                <p class="resultsAuthor">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//type: prev or next
const createButton = (page, type) => `
<button class="btn-inline resultsBtn-${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="searchIcon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    
</button>
`;

const displayButtons = (page, numResult, resPerPage) => {
    const pages = Math.ceil(numResult / resPerPage);
    let button;
    if(page === 1 && pages > 1){
        //Button to go next page
        button = createButton(page, 'next');
    } else if (page < pages){
        //Both buttons
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if(page === pages && pages > 1) {
        //Button to to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);

};

export const displayResults = (recipes, page = 1, resultpPage = 10) => {
    //render results of current page
    const start = (page - 1) * resultpPage;
    const end = page * resultpPage;

    recipes.slice(start, end).forEach(displayRecipe);

    //render pagination buttons
    displayButtons(page, recipes.length, resultpPage)
};
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.searchField'),
    searchResList: document.querySelector('.resultsList'),
    searchResults: document.querySelector('.results'),
    searchResPages: document.querySelector('.resultsPages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shoppingList'),
    likesMenu: document.querySelector('.likesField'),
    likesList: document.querySelector('.likesList')
};

export const elementStrings = {
    loader: 'loader'
};

export const displayLoader = parent => {
    const loader = `
        <div class = "${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) loader.parentElement.removeChild(loader);
};
import {elements} from './base';
import {limitRecipeTitle} from './searchView';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipeLove use').setAttribute('href', `img/icons.svg#${iconString}`);

    //icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const displayLike = like => {
    const markUp = `
    <li>
        <a class="likesLink" href="#${like.id}">
            <figure class="likesFig">
                <img src="${like.img}" alt="Test">
            </figure>
            <div class="likesData">
                <h4 class="likesName">${limitRecipeTitle(like.title)}</h4>
                <p class="likesAuthor">${like.author}</p>
            </div>
        </a>
    </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markUp);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likesLink[href="#${id}"]`).parentElement;
    if(el) el.parentElement.removeChild(el);

}
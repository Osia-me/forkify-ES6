// export default 'I am an exported string!';
import axios from 'axios';
import { key, proxy} from '../config';

export default class Search {
    constructor(query){
        this.query = query;
    }
    async getResult(){
        
        try{
            const result = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.recipe = result.data.recipes;
            //console.log(this.recipe);
        } catch(error){
            alert(error);
        }
    
    }
}

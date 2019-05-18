import Axios from "axios";
import configClass from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {
        try {
            const res = await Axios(`${configClass.crossOrigin}${configClass.apiUrlSearch}?q=${this.query}&app_id=${configClass.apiID}&app_key=${configClass.apiKey}&to=${configClass.apiTo}`);
            this.result = res.data.hits;
        } catch (error) {
            console.log(error);
        }
    }
}
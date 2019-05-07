import Axios from "axios";

const crossOrigin = 'https://cors-anywhere.herokuapp.com/';
const apiUrlSearch = 'https://api.edamam.com/search';
const apiID = '61bf74ca';
const apiKey = 'b561ba101ef1978aa77b13a4aeaacb8c';
const apiTo = 40;

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {
        try {
            const res = await Axios(`${crossOrigin}${apiUrlSearch}?q=${this.query}&app_id=${apiID}&app_key=${apiKey}&to=${apiTo}`);
            this.result = res.data.hits;
        } catch (error) {
            alert(error)
        }
    }
}
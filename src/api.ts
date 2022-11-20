
const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";


export interface ITvShow {
    backdrop_path: string;
    poster_path:string;
    id:number;
    overview:string;
    name:string;
    vote_average:number;
    first_air_date:string; 
}


export interface ITvShowResult {
    page: number;
    results: ITvShow[];
    total_results: number;
    total_pages: number;
}


// 영화 api


export interface IMovie {
    backdrop_path: string;
    poster_path:string;
    title:string;
    overview:String;
    id:string;
    release_date:string;
    vote_average:number;
}


export interface IGetMoviesResult {//Api값들 타입지정(개발자도구)
    dates: {
        maximum:"string";
        minimum:"string";
    };
    page: number,
    results: IMovie[],
    total_pages: number,
    total_results: number,
}


//검색 타입이랑 에이피아이
interface IMoviesearch {
    backdrop_path: string;
    poster_path:string;
    title:string;
    overview:String;
    id:number;
    release_date:string;
    vote_average:number;
    original_title:string;
}


export interface IGetSearchResult {
    page: number,
    results: IMoviesearch[],
    total_pages: number,
    total_results: number,
}

//검색 한 TV 보여주는 api
interface ITvSearch {
    backdrop_path: string;
    poster_path:string;
    name:string;
    overview:String;
    id:number;
    first_air_date:string;
    vote_average:number;
    original_title:string;
}



export interface IGetTvSearchResult {
    page: number,
    results: ITvSearch[],
    total_pages: number,
    total_results: number,
}



//API 가져오는 코드들


export interface IGetDetail {//디테일api는 띠로 만들어서관리
    runtime: number;
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function getPopular() {
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function getTop() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}


export function getDetail(movieId: string) {
    return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}


export function getTvShow() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}


export function getTopTvShow() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}




//영화검색과 Tv검색 api

export function getSearchMovies(keyword: string) {
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`).then(
        (response) => response.json()
    );
}

export function getSearchTv(keyword: string) {
    return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`).then(
        (response) => response.json()
    );
}
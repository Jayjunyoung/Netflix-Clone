import { useQuery } from 'react-query';
import { useLocation } from "react-router"
import { IGetMoviesResult , getSearchMovies, IGetSearchResult} from '../api';
import styled from "styled-components";
import MovieResult from "../Search/MovieResult"
import TvResult from '../Search/TvResult';


const Wrapper = styled.div`
    background-color: black;
    padding-bottom: 100px;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;




function Search() {
    const location = useLocation();
    console.log(location);
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log(keyword);//검색한 값이 나옴-키워드에 해당하는 값이나옴

    const { data: movieResults, isLoading } = useQuery<IGetSearchResult>(
        [`${keyword}`, "searchMovie"],
        () => {
            return getSearchMovies(keyword || "");
        }
    ); 
    console.log(movieResults);
    
    return (
        <Wrapper>
        {isLoading ? (
        <Loader>Loading...</Loader>
        ) : (
            <>
                <MovieResult search={keyword || ""}/>
            </>
        )
        }
        </Wrapper>
    );
}

export default Search;
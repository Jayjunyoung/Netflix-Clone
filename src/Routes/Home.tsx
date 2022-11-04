import { useQuery } from "react-query";
import { getDetail, getMovies, getPopular, getTop, IGetDetail, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from '../utils';
import { useState} from "react";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useHistory, useRouteMatch , useParams} from "react-router-dom";
import Slider from './Slider';
//import React from 'react';

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

const Banner = styled.div<{bgphoto:string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    -webkit-box-pack: center;
    background-image: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)),url(${(props) => props.bgphoto});
    background-size: cover;
`;

const Type = styled.h3`
    font-size: 20px;
    text-align: left;
    margin-left: 60px;
    padding: 20px 0px;
    position: relative;
`;

const Title = styled.h2`
    font-size: 58px;
    margin-bottom: 20px;
    margin-left: 10px;
`;

const Overview = styled.p`
    font-size: 36px;
    width: 50%;
    margin-left: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;//div적용시 세로정렬에서 가로정렬로 변화
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow-wrap: break-word;
    line-height: 50px;
`;





const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const BigMovie = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    min-width: 568px;//화면 안깨지게 하기위해
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;


const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 35px;
    position: relative;
    top: -80px;
    text-align: center;
`;

const BigOverview = styled.p`
    padding: 30px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
`;

const BigDate = styled.h4`
    text-align: center;
    font-size: 15px;
    padding: 15px;
    top: -80px;
    position: relative;
    color: ${(props) => props.theme.white.lighter};
`;

const BigTime = styled.h5`
    font-size: 15px;
    padding: 20px 30px;
    top: -80px;
    position: relative;
    color: ${(props) => props.theme.white.lighter};
    span {
        font-weight: bold;
    }
`;


const BigRate = styled.span`
    position: absolute;
    right: 30px;
    color: red;
`;




interface Params {
    movieId: string;
}

const offset = 6;//페이지의 크기인 6이될것(총 3페이지 필요)


//https://image.tmdb.org/t/p/original/efuPybo8V8KTYGslQphO74LRvm0.jpg -> 맨뒤는 이미지의 id를의미 
function Home() {//useQuery의 결과가 아이겟무비스리졸트를따를것
    const { movieId } = useParams<Params>();
    console.log(movieId);
    const history = useHistory();
    console.log(history);
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    console.log(bigMovieMatch);//url이 기록이됌
    const { scrollY } = useViewportScroll();

    //api받아오는 로직
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"],
        getMovies,
    );
    console.log(data);//data detail popular 셋다 객체로 나옴

    const {data: detail, isLoading: DetailLoading} = useQuery<IGetDetail>(
        ["movies", "detail", `${movieId}`],
        () => 
        getDetail(bigMovieMatch?.params.movieId!),
        { enabled: bigMovieMatch?.params.movieId !== undefined }
    );
    console.log(detail);

    //popular 영화
    const { data: popular, isLoading: getLoading} = useQuery<IGetMoviesResult>(
        ["movies", "popular"],
        getPopular,
    );
    console.log(popular);

    
    const { data: topRated, isLoading: getLoading2} = useQuery<IGetMoviesResult>(
        ["movies", "top"],
        getTop,
    );


    
    const onOverlayClick = () => history.push("/");//원래상태로돌아감:오버레이누르면



    const clickedMovie =
        bigMovieMatch?.params.movieId &&//라우트매치 되는지 확인하기
        data?.results.find((movie) => movie.id + "" === bigMovieMatch?.params.movieId);
    console.log(clickedMovie);//이걸 이용해 코드 챌린지

    //const detailMovie =
        //bigMovieMatch?.params.movieId &&//라우트매치 되는지 확인하기
        //detail?.results.find((movie) => movie.id + "" === bigMovieMatch?.params.movieId);
    //console.log(detailMovie);

    const popularMovie = 
        bigMovieMatch?.params.movieId &&//라우트매치 되는지 확인하기
        popular?.results.find((movie) => movie.id + "" === bigMovieMatch?.params.movieId);
    console.log(popularMovie);

    const topRatedMovie =
        bigMovieMatch?.params.movieId &&//라우트매치 되는지 확인하기
        topRated?.results.find((movie) => movie.id + "" === bigMovieMatch?.params.movieId);
    console.log(topRatedMovie);

    


    return  (
        <Wrapper>
    {isLoading || getLoading || getLoading2 ? (
        <Loader>Loading...</Loader>
    ) : (
        <>
        <Banner
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
        >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
        </Banner>
        {data && <Slider data={data} title="now playing" />}
        {popular && <Slider data={popular} title="popular" />}
        {topRated && <Slider data={topRated} title="topRated" />}

        <AnimatePresence>
            {bigMovieMatch ? (//영화를 클릭했을때만 나타남
                <>
                <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
                <BigMovie
                    style={{ top: scrollY.get() + 100 }}//어디서든 영화를 눌러도 가운데에 나옴
                    layoutId={bigMovieMatch.params.movieId}
                >
                    {clickedMovie && (
                    <>
                        <BigCover
                            style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                clickedMovie.backdrop_path,
                                "w500"
                            )})`,
                        }}
                        />
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <BigTime>
                            <span>상영시간: {detail?.runtime}분</span>
                        </BigTime>
                        <BigDate>
                            개봉일: {clickedMovie.release_date}
                            <BigRate> 
                                Rated: {clickedMovie.vote_average}점
                            </BigRate>
                        </BigDate>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                    )}
                    {popularMovie && (
                    <>
                        <BigCover
                            style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                popularMovie.backdrop_path,
                                "w500"
                            )})`,
                        }}
                        />
                        <BigTitle>{popularMovie.title}</BigTitle>
                        <BigTime>
                            <span>상영시간: {detail?.runtime}분</span>
                        </BigTime>
                        <BigDate>
                            개봉일: {popularMovie.release_date}
                            <BigRate>
                                Rated: {popularMovie.vote_average}점
                            </BigRate>
                        </BigDate>
                        <BigOverview>{popularMovie.overview}</BigOverview>
                    </>
                    )
                    }
                    {topRatedMovie && (
                    <>
                        <BigCover
                            style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                topRatedMovie.backdrop_path,
                                "w500"
                            )})`,
                        }}
                        />
                        <BigTitle>{topRatedMovie.title}</BigTitle>
                        <BigTime>
                            <span>상영시간: {detail?.runtime}분</span>
                        </BigTime>
                        <BigDate>
                            개봉일: {topRatedMovie.release_date}
                            <BigRate>
                                Rated: {topRatedMovie.vote_average}점
                            </BigRate>
                        </BigDate>
                        <BigOverview>{topRatedMovie.overview}</BigOverview>
                    </>
                    )
                    }
                </BigMovie>
                </>
            ) : null}
        </AnimatePresence>
        </>
    )}
    </Wrapper>
    )
    
}

export default Home;
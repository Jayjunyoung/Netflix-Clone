import { useQuery } from "react-query";
import { getTopTvShow, getTvShow, ITvShowResult} from "../api";
import styled from "styled-components";
import { makeImagePath } from '../utils';
import { useState } from "react";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useHistory, useRouteMatch , useParams} from "react-router-dom";
import Slider from './Slider';

const Wrapper = styled.div`
    background-color: black;
    padding-bottom: 200px;
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
    background-image: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)),url(${(props) => props.bgphoto});
    background-size: cover;
`;

const Type = styled.h3`
    font-size: 20px;
    text-align: left;
    margin-left: 60px;
    padding: 20px 0px;
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


const Box = styled(motion.div)<{ bgphoto: string }>`
    background-color: white;
    background-image: url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;//상하좌우
    height: 200px;
    font-size: 66px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;//원래는 안보여
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {//info안에있는 h4에 접근
        text-align: center;
        font-size: 15px;
        padding: 5px;
        font-weight: bold;
    }
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const BigTv = styled(motion.div)`
    position: absolute;
    box-sizing: border-box;
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
    font-size: 30px;
    padding: 30px;
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
`;


const BigRate = styled.span`
    position: absolute;
    right: 30px;
    color: red;
`;


const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,//브라우저 전체의넓이
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    },
};

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {//커서가 있을때
        scale: 1.3,
        y: -80,
    transition: {
        delay: 0.5,//영화들의 애니메이션에 딜레이를 줘서 서로겹치지않게
        duaration: 0.1,
        type: "tween",
        },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
    transition: {
            delay: 0.5,
            duaration: 0.1,
            type: "tween",
        },
    },
};

interface Params {
    tvShowId: string;
}

const offset = 6;//페이지의 크기인 6이될것(총 3페이지 필요)


//https://image.tmdb.org/t/p/original/efuPybo8V8KTYGslQphO74LRvm0.jpg -> 맨뒤는 이미지의 id를의미 
function Tv() {//useQuery의 결과가 아이겟무비스리졸트를따를것
    const { tvShowId } = useParams<Params>();
    console.log(tvShowId);
    const history = useHistory();
    console.log(history);
    const bigTvMatch = useRouteMatch<{ tvShowId: string }>("/tv/:tvShowId");
    console.log(bigTvMatch);//url이 기록이됌
    const { scrollY } = useViewportScroll();

    //api받아오는 로직
    const { data: popular, isLoading: popularLoading } = useQuery<ITvShowResult>(
        ["popular"],
        getTvShow,
    );
    console.log(popular);
    console.log(popular?.results.length);//20개임


    const {data: topRated, isLoading: topLoading} = useQuery<ITvShowResult>(
        ["topRated"],
        getTopTvShow,
    );
    console.log(topRated);
    
    
    const onBoxClicked = (tvShowId: string) => {
        history.push(`/tv/${tvShowId}`);//url에 영화아이디넘겨
    };
    const onOverlayClick = () => history.push("/tv");//원래상태로돌아감:오버레이누르면

    const popularTv = 
        bigTvMatch?.params.tvShowId &&//라우트매치 되는지 확인하기
        popular?.results.find((tv) => tv.id + "" === bigTvMatch?.params.tvShowId);
    console.log(popularTv);

    const topTv =
        bigTvMatch?.params.tvShowId &&//라우트매치 되는지 확인하기
        topRated?.results.find((tv) => tv.id + "" === bigTvMatch?.params.tvShowId);
    console.log(topTv);

    return  (
        <Wrapper>
    {popularLoading || topLoading? (
        <Loader>Loading...</Loader>
    ) : (
        <>
        <Banner
            bgphoto={makeImagePath(popular?.results[0].backdrop_path || "")}
        >
            <Title>{popular?.results[0].name}</Title>
            <Overview>{popular?.results[0].overview}</Overview>
        </Banner>
        {popular && <Slider data={popular} title="popular" />}
        {topRated && <Slider data={topRated} title="topRated" />}

        <AnimatePresence>
        {bigTvMatch ? (//영화를 클릭했을때만 나타남
                <>
                <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
                <BigTv
                    style={{ top: scrollY.get() + 100 }}//어디서든 영화를 눌러도 가운데에 나옴
                    layoutId={bigTvMatch.params.tvShowId}
                >
                    {popularTv && (
                    <>
                        <BigCover
                            style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                popularTv.backdrop_path,
                                "w500"
                            )})`,
                        }}
                        />
                        <BigTitle>{popularTv.name}</BigTitle>
                        <BigTime>
                            
                        </BigTime>
                        <BigDate>
                            상영일: {popularTv.first_air_date}
                            <BigRate>
                                Rated: {popularTv.vote_average}점
                            </BigRate>
                        </BigDate>
                        <BigOverview>{popularTv.overview}</BigOverview>
                    </>
                    )}
                    {topTv && (
                    <>
                        <BigCover
                            style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                topTv.backdrop_path,
                                "w500"
                            )})`,
                        }}
                        />
                        <BigTitle>{topTv.name}</BigTitle>
                        <BigTime>
                            
                        </BigTime>
                        <BigDate>
                            상영일: {topTv.first_air_date}
                            <BigRate>
                                Rated: {topTv.vote_average}점
                            </BigRate>
                        </BigDate>
                        <BigOverview>{topTv.overview}</BigOverview>
                    </>
                    )}
                </BigTv>
                </>
            ) : null}
        </AnimatePresence>
        </>
    )}
    </Wrapper>
    )
    
}

export default Tv
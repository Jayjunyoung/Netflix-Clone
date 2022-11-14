import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState} from "react";
import { useHistory, useRouteMatch , useParams} from "react-router-dom";
import { getDetail, getMovies, getPopular, getTop, IGetDetail, IGetMoviesResult,ITvShowResult } from "../api";
import { makeImagePath } from '../utils';



const SliderRow = styled.div`
    position: relative;
    height: 200px;
    top: -100px;
    margin-bottom: 80px;
    z-index: 0;
`;


const Type = styled.h3`
    font-size: 20px;
    text-align: left;
    margin-left: 60px;
    padding: 20px 0px;
    position: relative;
`;


const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
    padding: 0px 60px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
    position: relative;
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


const Arrow = styled.svg`
    position: absolute;
    left: 120px;
    width: 30px;
    height: 30px;
    margin-left: 60px;
    cursor: pointer;
    path {
        fill: white;//svg로고에 하얀색으로 색상 변경
    }
`;



interface Params {
    movieId: string;
}


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

const rowVariants = {//Custom 기능 사용
    hidden: (back: boolean) => ({
        x: back ? -window.outerWidth - 5 : window.outerWidth + 5,//브라우저 전체의넓이
    }),
    visible: {
        x: 0,
    },
    exit: (back: boolean) =>  ({
        x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
    }),
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

const offset = 6;

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


interface SliderProps {
    data?: IGetMoviesResult | ITvShowResult;//result[]
    title?: string;
}

function Slider({data, title}: SliderProps) {//구조분해 할당기법
    console.log({data});//데이터랑 타이틀은 다 넘어온 상태
    console.log({title});

    const [currentIndex, setCurrentIndex] = useState(0);
    
    console.log(currentIndex);
    
    
    const [leaving, setLeaving] = useState(false);
    const [back, setBack] = useState(false);

    console.log(leaving);//이게 true에서 false로 바껴야 하는데 안됌
    console.log(back);

    const history = useHistory();//현재 URL을 가져옴
    console.log(history);

    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (movieId: string) => {
        history.push(`/movies/${movieId}`);//url에 영화아이디넘겨
    };



    const prevButton = () => {
        if (data) {//data popular topRated 구별해줌
            console.log(data);
            setBack(true);
            if (leaving) return;
            toggleLeaving();//leaving이 true가 될것 , exit이 끝나면 false가됌
            const totalMovies = data.results.length - 1;
            //배너에 있는 첫번째 영화 제외하면 슬라이더에들어가는 영화는 18개
            const minIndex = Math.floor(totalMovies / offset) - 3;
            //page는 0부터 시작하므로 -1해주기
            setCurrentIndex((prev) => (prev === minIndex ? 2 : prev - 1));
        }
    };

    const nextButton = () => {
        if (data) {
            console.log(data);
            setBack(false);
            if (leaving) return;
            toggleLeaving();//leaving이 true가 될것 , exit이 끝나면 false가됌
            const totalMovies = data.results.length - 1;
            //배너에 있는 첫번째 영화 제외하면 슬라이더에들어가는 영화는 18개
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            //page는 0부터 시작하므로 -1해주기
            setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };

    return (
        <>
        <SliderRow>
            <Type>
                {title}
                <Arrow
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512"
                onClick={prevButton}
                >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                </Arrow>
                <Arrow 
                style={{
                    marginLeft:"90px",
                }}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512"
                onClick={nextButton}
                >
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                </Arrow>
            </Type>
            <AnimatePresence 
            initial={false} 
            onExitComplete={toggleLeaving}
            custom={back}>
            <Row
                custom={back}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}//부드럽게 슬라이더 되도록 
                key={currentIndex}
            >
                {data?.results
                    .slice(1)//이미사용한영화제외, index: page수
                    .slice(offset * currentIndex, offset * currentIndex + offset)
                    .map((movie) => (//data쓸 필요없고 새로운 인자로 고고
                    <Box
                        layoutId={movie.id + title!}//layoutId : string임
                        key={movie.id + title!}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onBoxClicked(movie.id + title!)}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                        <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                        </Info>
                    </Box>
                ))}
            </Row>
            </AnimatePresence>
        </SliderRow>
        </>
    )
}




export default Slider
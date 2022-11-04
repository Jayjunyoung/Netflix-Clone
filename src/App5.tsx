import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";


function App5() {//null: 아무것도선택X string: "1" ~ "4"
    return (//구현한것: 리액트 라우터 이용
        <Router>
            <Header />
            <Switch>
                <Route path={["/tv/:tvShowId","/tv"]}>
                    <Tv />
                </Route>
                <Route path="/search">
                    <Search />
                </Route>
                <Route path={["/movies/:movieId", "/"]}>
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}

export default App5;
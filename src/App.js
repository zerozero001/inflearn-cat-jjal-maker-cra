import logo from "./logo.svg";
import React from "react";
import Title from "./components/Title";
import MainCard from "./components/MainCard";
import "./App.css";

function App() {
  console.log("야옹");

  const jsonLocalStorage = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
      return JSON.parse(localStorage.getItem(key));
    },
  };

  const fetchCat = async (text) => {
    const OPEN_API_DOMAIN = "https://cataas.com";
    const response = await fetch(
      `${OPEN_API_DOMAIN}/cat/says/${text}?json=true`
    );
    const responseJson = await response.json();
    return `${OPEN_API_DOMAIN}/${responseJson.url}`;
  };

  const render = document.querySelector("#app");

  const Form = (props) => {
    const [value, setValue] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");

    const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

    function handleInputChange(ev) {
      //console.log("ev : ", ev.target.value.toUpperCase());
      const userValue = ev.target.value;
      //console.log(includesHangul(userValue));

      setErrorMessage("");
      if (includesHangul(userValue)) {
        setErrorMessage("한글은 입력하실 수 없습니다.");
      }

      setValue(ev.target.value.toUpperCase());
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      setErrorMessage("");
      if (value === "") {
        setErrorMessage("빈 값으로 생성할 수 없습니다");
        return;
      }

      props.updateMainCat(value);
    }

    return (
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="name"
          placeholder="영어 대사를 입력해주세요"
          value={value}
          onChange={handleInputChange}
        />

        <button type="submit">생성</button>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </form>
    );
  };

  function Favorites(props) {
    if (props.favoriteList.length === 0) {
      return <div>사진 위 하트를 눌러 즐겨찾기에 추가해보세요</div>;
    }

    return (
      <ul className="favorites">
        {props.favoriteList.map((el) => {
          return <CatItem key={el} image={el} title="CAT1" />;
        })}
      </ul>
    );
  }

  function CatItem(props) {
    return (
      <li>
        <img src={props.image} style={{ width: "150px" }}></img>
      </li>
    );
  }

  const App = () => {
    const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
    const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
    const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

    const [counter, setCounter] = React.useState(() => {
      console.log("counter init");
      return jsonLocalStorage.getItem("catCount");
    });
    const [mainCat, setMainCat] = React.useState(CAT1);
    const [favoriteList, setFavoriteList] = React.useState(
      jsonLocalStorage.getItem("favoriteList") || []
    );

    React.useEffect(() => {
      initApp();
    }, []);

    React.useEffect(() => {}, [counter]);

    async function initApp() {
      let firstCat = await fetchCat("first cat");
      setMainCat(firstCat);
    }

    //initApp();

    async function updateMainCat(text) {
      let newURL = await fetchCat(text);
      console.log("newURL : ", newURL);
      setCounter((prev) => {
        const next = prev + 1;
        jsonLocalStorage.setItem("catCount", next);
        return next;
      });
      setMainCat(newURL);
    }

    function handleHeartClick() {
      const nextFavorites = [...favoriteList, mainCat];
      setFavoriteList(nextFavorites);
      jsonLocalStorage.setItem("favoriteList", nextFavorites);
    }

    const numberCount = counter > 0 ? counter + "번째 " : "";
    const heartClicked = favoriteList.includes(mainCat);

    return (
      <div>
        <Title title={numberCount + "고양이 가라사대"}></Title>
        <Form updateMainCat={updateMainCat}></Form>
        <MainCard
          image={mainCat}
          onHeartClick={handleHeartClick}
          heartClicked={heartClicked}
        ></MainCard>
        <Favorites favoriteList={favoriteList}></Favorites>
      </div>
    );
  };
}

export default App;

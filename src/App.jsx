import { useEffect, useState } from "react";
import MovieList from "./components/MovieList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MovieListHeading from "./components/MovieListHeading";
import SerachBox from "./components/SerachBox";
import ScrollContainer from "react-indiana-drag-scroll";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]); //선호작 영화

  //서버에서 검색한 영화들 데이터를 가져옴
  async function getMovieRequest(searchValue) {
    //문자열안에 변수? 사용 시 쌍따옴표 사용X ` ` 사용
    const url = `https://www.omdbapi.com/?apikey=62354c5c&s=${searchValue}`;
    const response = await fetch(url); //OMDB 서버에서 데이터를 제이슨으로 받음
    const jsonData = await response.json(); //제이슨문자열을 자바스크립트 객체로 변환
    // await 사용 시 async 사용 해야 함
    console.log(jsonData);
    //검색 결과 없을 경우에는 영화를 업데이트 하지 않음
    if (jsonData.Search != null && jsonData.Search.length > 0) {
      setMovies(jsonData.Search);
    }
  }
  //앱 실행 시 처음 한번만 실행 [] 빈괄호일때만, 검색어가 바뀔때 마다 실행 [searchValue]
  //useEffect(실행함수, [])
  useEffect(() => {
    if (searchValue.length >= 3) {
      getMovieRequest(searchValue);
    }
  }, [searchValue]);

  //처음 한번 실행 로컬스토리지에서 선호작 가져오기
  useEffect(() => {
    const movieLikes = JSON.parse(localStorage.getItem("favorites"));
    if (movieLikes) {
      setFavorites(movieLikes);
    }
  }, []);

  //로컬에 저장하는 함수
  function saveToLocalStorage(items) {
    localStorage.setItem("favorites", JSON.stringify(items));
  }

  //선호작 추가하는 함수
  function addFavoriteMovie(movies) {
    if (!favorites.some((fm) => fm.imdbID === movies.imdbID)) {
      const newList = [...favorites, movies];
      setFavorites(newList); // state 업데이트
      saveToLocalStorage(newList); // 저장소에 저장
    } else {
      alert("이미 추가된 영화입니다.");
    }
  }

  //선호작 제거하는 함수
  function removeMovie(movie) {
    //필터를 써서 id가 같은 영화가 있으면 제거됨!
    const newList = favorites.filter((fm) => fm.imdbID != movie.imdbID);
    setFavorites(newList);
    saveToLocalStorage(newList);
  }

  return (
    <div className="container-fluid movie-app">
      <div className="row align-items-center my-4">
        <MovieListHeading heading="영화 검색과 선호작 등록" />
        <SerachBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      {/* props 로 전달 */}
      <ScrollContainer className="row scroll-container">
        <MovieList
          addMovie={true}
          movies={movies}
          handleClick={addFavoriteMovie}
        />
      </ScrollContainer>

      <div className="row align-items-center my-4">
        <MovieListHeading heading="내 선호작" />
      </div>
      <ScrollContainer className="row scroll-container">
        <MovieList
          addMovie={false}
          movies={favorites}
          handleClick={removeMovie}
        />
      </ScrollContainer>
    </div>
  );
}

export default App;

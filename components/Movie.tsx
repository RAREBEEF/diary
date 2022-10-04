import Image from "next/image";
import React, { useRef, useState } from "react";
import useInput from "../hooks/useInput";
import Button from "./Button";

interface Props {
  todayOrTheDay: "오늘" | "그 날";
  selectedMovies: Array<any>;
  setSelectedMovies: React.Dispatch<React.SetStateAction<Array<any>>>;
  setSearching: React.Dispatch<React.SetStateAction<boolean>>;
}

const Movie: React.FC<Props> = ({
  todayOrTheDay,
  selectedMovies,
  setSelectedMovies,
  setSearching,
}) => {
  const { value: movieKeyword, onChange: onMovieKeywordChange } = useInput("");
  const [movieResult, setMovieResult] = useState<any>();
  const movieSearchListRef = useRef<HTMLUListElement>(null);
  const movieSelectedListRef = useRef<HTMLUListElement>(null);
  /**
   * 영화 검색
   */
  const getMovie = async (keyword: string = movieKeyword, page: number = 1) => {
    setSearching(true);

    const url = `api/movie/${keyword}/${page}`;

    await fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setMovieResult({
          keyword,
          result,
          getNextMovie: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            movieSearchListRef.current?.scrollTo({
              left: 0,
              behavior: "smooth",
            });
            getMovie(movieKeyword, page + 1);
          },
          getPrevMovie: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            movieSearchListRef.current?.scrollTo({
              left: 0,
              behavior: "smooth",
            });
            getMovie(movieKeyword, page - 1);
          },
        });

        movieSearchListRef.current?.scrollTo({
          left: 0,
          behavior: "smooth",
        });

        setSearching(false);
      })
      .catch((error) => {
        window.alert(
          "영화 검색에 실패하였습니다.\n잠시 후 다시 시도해 주세요."
        );
        setSearching(false);
      });
  };

  // 영화 검색 버튼 클릭
  const onSearchMovie = () => {
    if (movieKeyword.length === 0) return;
    getMovie();
  };

  // 엔터 입력
  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key || e.keyCode;
    (key === "Enter" || key === 13) && onSearchMovie();
  };

  // 영화 추가
  const onAddMovie = (movie: any) => {
    setSelectedMovies((prev) => [...prev, movie]);
  };

  // 영화 제거
  const onRemoveMovie = (i: number) => {
    setSelectedMovies((prev) => {
      const prevMovies = [...prev];
      prevMovies.splice(i, 1);
      return prevMovies;
    });
  };

  return (
    <details className="movie-wrapper">
      <summary>{todayOrTheDay} 본 영화</summary>
      <div className="selected">
        <ul className="movie-list" ref={movieSelectedListRef}>
          {selectedMovies.length === 0 ? (
            <p className="empty">비어있음</p>
          ) : (
            selectedMovies.map((movie: any, i) => (
              <li
                key={i}
                className="movie-item"
                onClick={() => {
                  onRemoveMovie(i);
                }}
              >
                <Image
                  src={
                    "https://image.tmdb.org/t/p/original" + movie.poster_path
                  }
                  alt={movie.title}
                  width={500}
                  height={750}
                  objectFit="contain"
                  layout="responsive"
                />
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="search">
        <h4>영화 검색</h4>
        <div
          className="input-wrapper"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            className="movie"
            list="movie-list"
            type="text"
            value={movieKeyword}
            onChange={onMovieKeywordChange}
            placeholder={`제목`}
            size={15}
            onKeyDown={onPressEnter}
          />
          <Button onClick={onSearchMovie}>검색</Button>
        </div>
        {movieResult && (
          <>
            <p>
              &quot;{movieResult.keyword}&quot; 검색 결과 (
              {movieResult.result.total_results}건)
            </p>
            <ul className="movie-list" ref={movieSearchListRef}>
              {movieResult?.result?.results?.map((movie: any, i: number) => (
                <li
                  key={i}
                  className="movie-item"
                  onClick={() => {
                    onAddMovie(movie);
                  }}
                >
                  <Image
                    src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                    alt={movie.title}
                    width={500}
                    height={750}
                    objectFit="contain"
                    layout="responsive"
                  />
                  <h5>{movie.title}</h5>
                </li>
              ))}
            </ul>
          </>
        )}
        {movieResult && movieResult.result.total_pages !== 0 && (
          <div className="pagination">
            {movieResult.result.page !== 1 && (
              <Button onClick={movieResult.getPrevMovie}>이전</Button>
            )}
            {movieResult.result.page !== movieResult.result.total_pages &&
              movieResult.result.total_pages !== 0 && (
                <Button onClick={movieResult.getNextMovie}>다음</Button>
              )}
          </div>
        )}
      </div>
    </details>
  );
};

export default Movie;

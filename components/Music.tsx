import Image from "next/image";
import React, { useRef, useState } from "react";
import { auth } from "../fb";
import useInput from "../hooks/useInput";
import Button from "./Button";
import XMLJS from "xml-js";
import useDecode from "../hooks/useDecode";

interface Props {
  todayOrTheDay: "오늘" | "그 날";
  selectedMusics: Array<any>;
  setSelectedMusics: React.Dispatch<React.SetStateAction<Array<any>>>;
  setSearching: React.Dispatch<React.SetStateAction<boolean>>;
}

const Music: React.FC<Props> = ({
  todayOrTheDay,
  selectedMusics,
  setSelectedMusics,
  setSearching,
}) => {
  const decodeHTMLEntities = useDecode();
  const MusicSearchListRef = useRef<HTMLUListElement>(null);
  const [musicResult, setMusicResult] = useState<any>();
  const { value: musicKeyword, onChange: onMusicKeywordChange } = useInput("");

  // 음악 검색
  const getMusic = async () => {
    setSearching(true);

    if (!auth.currentUser) return;

    const key = auth.currentUser.email;
    const url = `api/music/${musicKeyword}/${key}`;

    await fetch(url)
      .then((response) => response.text())
      .then((result) => {
        const json = XMLJS.xml2json(result, { compact: true });
        const items = JSON.parse(json).rss.channel.item;

        if (!items) {
          setMusicResult({
            keyword: musicKeyword,
            result: [],
          });
          setSearching(false);
          return;
        }

        setMusicResult({
          keyword: musicKeyword,
          result: items?.length > 1 ? items : [items],
        });
        MusicSearchListRef.current?.scrollTo({
          left: 0,
          behavior: "smooth",
        });
        setSearching(false);
      })
      .catch((error) => {
        window.alert(
          "음악 검색에 실패하였습니다.\n잠시 후 다시 시도해 주세요."
        );
        setSearching(false);
      });
  };

  // 음악 검색 버튼 클릭
  const onSearchMusic = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (musicKeyword.length === 0) return;
    getMusic();
  };

  // 엔터 입력
  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key || e.keyCode;
    (key === "Enter" || key === 13) && onSearchMusic();
  };

  // 음악 추가
  const onAddMusic = (music: any) => {
    setSelectedMusics((prev) => [...prev, music]);
  };

  // 음악 제거
  const onRemoveMusic = (i: number) => {
    setSelectedMusics((prev) => {
      const prevMusics = [...prev];
      prevMusics.splice(i, 1);
      return prevMusics;
    });
  };

  return (
    <details className="music-wrapper" open={selectedMusics.length !== 0}>
      <summary>{todayOrTheDay}의 음악</summary>
      <div className="selected">
        <ul className="music-list">
          {selectedMusics.length === 0 ? (
            <p className="empty">비어있음</p>
          ) : (
            selectedMusics.map((music: any, i) => (
              <li
                key={i}
                className="music-item"
                onClick={() => {
                  onRemoveMusic(i);
                }}
              >
                <Image
                  src={music["maniadb:album"].image["_cdata"]}
                  alt={music.title["_cdata"]}
                  width={500}
                  height={500}
                  objectFit="contain"
                  layout="responsive"
                />
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="search">
        <h4>음악 검색</h4>
        <div
          className="input-wrapper"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            className="music"
            type="text"
            value={musicKeyword}
            onChange={onMusicKeywordChange}
            placeholder={`제목`}
            size={15}
            onKeyDown={onPressEnter}
          />
          <Button onClick={onSearchMusic}>검색</Button>
        </div>
        {musicResult && (
          <>
            <p>
              &quot;{musicResult.keyword}&quot; 검색 결과 (
              {musicResult?.result?.length || "0"}건, 최대 50건)
            </p>
            <ul className="music-list" ref={MusicSearchListRef}>
              {musicResult?.result?.map((music: any, i: number) => (
                <li
                  key={i}
                  className="music-item"
                  onClick={() => {
                    onAddMusic(music);
                  }}
                >
                  <Image
                    src={music["maniadb:album"].image["_cdata"]}
                    alt={music.title["_cdata"]}
                    width={500}
                    height={500}
                    objectFit="contain"
                    layout="responsive"
                  />
                  <h5>
                    {decodeHTMLEntities(
                      music["maniadb:artist"].name["_cdata"]
                    ) +
                      " - " +
                      decodeHTMLEntities(music.title["_cdata"])}
                  </h5>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </details>
  );
};

export default Music;

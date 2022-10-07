import React from "react";
import useInput from "../hooks/useInput";
import Button from "./Button";

interface Props {
  todayOrTheDay: "오늘" | "그 날";
  tags: Array<any>;
  setTags: React.Dispatch<React.SetStateAction<Array<any>>>;
}

const Tag: React.FC<Props> = ({ todayOrTheDay, tags, setTags }) => {
  const { value: tag, setValue: setTag, onChange: onTagChange } = useInput("");

  // 태그 추가
  const onAddTag = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (tag.length === 0) return;
    setTags((prev) => {
      if (prev.indexOf(tag) !== -1) return prev;
      return [...prev, tag];
    });
    setTag("");
  };

  // 태그 제거
  const onRemoveTag = (i: number) => {
    setTags((prev) => {
      const prevTags = [...prev];
      prevTags.splice(i, 1);
      return prevTags;
    });
  };

  return (
    <details className="tag-wrapper" open={tags.length !== 0}>
      <summary>{todayOrTheDay}의 태그</summary>
      <div className="selected">
        <ul className="tag-list">
          {tags.length === 0 ? (
            <p className="empty">비어있음</p>
          ) : (
            tags.map((tag: any, i) => (
              <li
                key={i}
                className="tag-item"
                onClick={() => {
                  onRemoveTag(i);
                }}
              >
                <span className="hash">#</span>
                {tag}
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="add">
        <div
          className="input-wrapper"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            className="tag"
            type="text"
            value={tag}
            onChange={onTagChange}
            placeholder={`태그`}
            size={15}
          />
          <Button onClick={onAddTag}>추가</Button>
        </div>
      </div>
    </details>
  );
};

export default Tag;

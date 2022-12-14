<a href="https://diary-daily.netlify.app">일기장</a>  
<a href="https://velog.io/@drrobot409/Next.js-%EC%9D%BC%EA%B8%B0%EC%9E%A5-%EB%A7%8C%EB%93%A4%EA%B8%B0">Velog</a>

Next.js로 일기장 웹 애플리케이션을 만들어 보았다. Next.js를 활용한 첫 프로젝트이다.

<br/>

---

# 구현 기능

## 1. 달력

![](https://velog.velcdn.com/images/drrobot409/post/ce152f8c-36a8-45c9-8561-f7df4392e6f1/image.png)

달력의 날짜를 클릭해 해당 날짜의 일기를 작성하거나 작성한 일기를 확인할 수 있도록 하였다.

달력을 생성하는 과정은 아래와 같다.

**1. 날짜 배열 만들기**

- 달력의 앞 공백과 해당 월의 모든 날짜를 추가한 배열을 만든다.
  - 테이블 구조로 만들기 위해 공백과 날짜는 모두 `<td>` 태그로 이루어진다.
  - 여기서 앞 공백이란 해당 월의 첫째 날(1일) 앞의 빈 칸들을 말한다.
  - 이전 달 마지막 날의 요일을 알아낸 뒤 일요일부터 해당 요일까지의 거리만큼 빈 칸을 추가하면 된다. (예시: 이전 달의 마지막 날이 수요일이었다면 첫 주차의 일, 월, 화, 수를 빈 칸으로 채움)

**2. 배열을 1주 단위(7칸)로 나누기**

- 위에서 만든 배열의 맨 앞에서 7개를 꺼낸다.
- 꺼낸 7개의 `<td>` 태그들을 `<tr>` 태그로 감싸준다.
- 이후 반복
- 만약 꺼낸 아이템이 7개 미만일 경우 다음과 같이 처리한다.
  - 아이템이 7개 미만인 경우는 마지막 주차를 의미한다.
  - 7개에서 모자란 수만큼 해당 `<tr>` 태그의 마지막에 빈 칸을 추가한다.
- 배열에 더 이상 아이템이 남지 않았어도 6주차까지 빈칸으로 채워서 생성한다.
  - 달력을 항상 최대 칸 수인 42칸(7일\*6주차)으로 만들어서 모든 월의 달력을 같은 높이로 유지하기 위함이다.

달력 작성이 생각보다 고려해야 할 점이 많아서 알고리즘 문제 푸는 느낌이 들어 재밌었다.

<br />

## 2. 일기 데이터 저장 & 불러오기

### 저장

![](https://velog.velcdn.com/images/drrobot409/post/6c4f1bf8-78dc-4636-b15c-e5f90879a9ab/image.png)
앱을 Firebase에 연결하여 작성한 일기를 저장하였다.

각 일기는 데이터베이스의 `uid - 연도 - 월 - 일` 경로에 저장되며 일기의 구조는 다음과 같다.

```js
{
  attachmentId: 첨부사진 id,
  attachmentUrl: 첨부사진 url,
  content: 일기 내용,
  date: 날짜,
  mood: 기분,
  title: 제목,
  weather: 날씨
}
```

### 불러오기

![](https://velog.velcdn.com/images/drrobot409/post/5e6255fd-9f46-400d-a2e8-768eec944e72/image.png)

일기는 홈화면의 달력 페이지에서 월 단위로 한 번에 불러오도록 하였는데, 달력 페이지에서 일기가 작성된 날짜를 구분하기 위해서는 어차피 데이터를 불러와야 하기 때문이다.

연 단위로 불러오는 것도 고민해 보았지만 만약 일기를 하루도 빼먹지 않고 쓴다면 연간 360개 이상의 일기가 작성될 것이고 이 정도 양의 일기를 한 번에 불러오는 것은 비효율적이라고 생각했다.

따라서 홈 화면의 달력을 넘길 때 마다 해당 월의 데이터를 불러오는 방식을 채택했는데, 이미 데이터를 불러온 월의 경우 중복으로 데이터를 불러오지 않도록 하였다.

<br />

## 3. 기간별 일기

![](https://velog.velcdn.com/images/drrobot409/post/66588d88-1cf3-401c-a249-e7d4b5bdc7a3/image.png)

달력은 일기가 작성되지 않은 날짜도 모두 출력하므로 작성한 일기들만 모아보고 싶은 경우에는 조금 부적합하다.

따라서 이를 보완할만한 기능을 추가했는데, 원하는 기간 내의 일기들을 모두 불러와서 목록 형태로 출력해주는 기능이다. 목록이 너무 길어질 것에 대비해 페이지네이션도 추가하였다.

<br />

## 4. 영화 및 음악 (2022.10.04 추가)

![](https://velog.velcdn.com/images/drrobot409/post/cbb58c8c-39c5-4fef-b84a-391494a4750d/image.png)
![](https://velog.velcdn.com/images/drrobot409/post/9a43a4f4-5989-4012-9d92-5a895a2e943c/image.png)

영화 API와 음악 API를 활용해 일기에 영화와 음악을 검색하고 추가할 수 있도록 하였다.

영화 API는 [TMDB](https://www.themoviedb.org/?language=ko), 음악 API는 [maniadb](https://www.maniadb.com/)를 사용하였다.

영화와 음악의 검색창이 한 페이지 안에 공존하다보니 검색을 위해 엔터키를 눌렀을 때 현재 focus 된 input 창에 알맞은 검색 버튼이 실행되지 않는다는 문제가 있었다. 따라서 각 input에 keydown 이벤트 리스너를 추가하여 엔터키가 입력될 때 알맞은 검색 기능이 실행되도록 하였다.

영화의 경우 1만 건까지 검색 결과를 확인할 수 있기 때문에 검색 결과를 적당한 양으로 끊어서 로드할 필요가 있었다. 따라서 1회 검색 당 출력할 결과를 20건으로 제한하고, 다음 20개의 검색을 요청하는 메소드를 검색 결과와 함께 저장하여 필요에 따라 메소드를 호출할 수 있도록 하였다.

반면 음악의 경우 API에서 최대로 지원하는 검색 건수가 적은 편이어서 아쉽지만 검색 결과를 50건으로 제한하였다.

<br/>

## 4. 태그 (2022.10.07 추가)

![](https://velog.velcdn.com/images/drrobot409/post/4d573613-0389-4f2c-ba12-9f03400225b4/image.png)

일기에 태그를 달고 태그별로 일기를 모아 볼 수 있는 기능을 구현하였다.

태그들은 db의 각 일기 데이터에 저장되는 것과 별개로 유저마다 tags라는 컬렉션을 새로이 추가하고 그 안에 저장함으로써 해당 유저가 사용 중인 태그들과 그에 해당하는 일기의 날짜들을 빠르게 읽어올 수 있도록 하였다.

<br/>

## 5. 공휴일 api

공휴일 api를 활용하여 공휴일의 날짜는 빨간색으로 출력되도록 구분하였다.

공휴일 api는 일기 데이터와 다르게 데이터의 규모가 크지 않기 때문에 연간 단위로 불러오도록 하였으며, 마찬가지로 이미 불러온 연도의 데이터는 중복으로 불러오지 않도록 하였다.

<br/>

## 6. PWA

![](https://velog.velcdn.com/images/drrobot409/post/ee1a40e9-9104-4ece-89f7-a454bf7aee4d/image.png)
크롬 브라우저의 PWA 기준에 부합하도록 개발하였다.

standalone 여부 등에 따라 우상단에 설치 버튼이 출력되도록 하였으며 버튼 클릭 시 크롬의 경우 곧바로 설치로 이어지고 그 외의 경우 안내 페이지를 출력하도록 하였다.

---

# 스타일

## 1. 테마 색상

#cabfb2
#6d6a66

<br />

## 2. 로고

![](https://velog.velcdn.com/images/drrobot409/post/bcce4ab7-cab9-4d59-84a0-2b59f30d899d/image.png)

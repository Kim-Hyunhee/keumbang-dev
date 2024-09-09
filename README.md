# loc-based-restau-recommendation-service

> 금을 한창 열심히 팔고 있던 알레테이아는, 금을 판매하고 구매하는 서비스를 제공하기로 결정했습니다!
알레테이아는 앱을 통해 구매, 판매 주문을 관리하려고 합니다! 또한 미래에 서비스가 확장될 것을 고려하여,
인증을 담당하는 서버를 별도로 구축하기로 결정했는데요, 
과연 어떻게 해야 잘 만들 수 있을까요?

## 목차

#### [1. 개요](#개요)

##### [&nbsp;&nbsp;1-1. 실행 환경](#실행-환경)

##### [&nbsp;&nbsp;1-2. 기술 스택](#기술-스택)

##### [&nbsp;&nbsp;1-3. 프로젝트 관리](#프로젝트-관리)

#### 2. ERD

##### [&nbsp;&nbsp;2-1. ERD](#2-erd)

#### [3. 기능구현](#기능구현)

#### [4. 데이터 파이프라인 설정](#데이터-파이프라인-설정)

##### [&nbsp;&nbsp;4-1. 크론 작업 설정](#크론-작업-설정)

##### [&nbsp;&nbsp;4-2. 전처리 과정](#전처리-과정)

</br>

## 개요

- RESTful API를 활용하여 구매, 판매 주문 CRUD를 수행하는 서버 A 구현
- 서버 A와 gRPC를 통해 소통하며, 인증만을 담당하는 서버 B 구현

### 실행 환경

- .env 환경변수 파일 생성</br>
  해당 프로젝트는 로컬 환경 실행이며, 아래 항목들이 환경변수 파일에 전부 존재해야 합니다.

```
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_DATABASE=

JWT_SECRET_KEY=
```

- 로컬 실행시

```
npm install
cd auth-server
npm run start
```
```
npm install
cd keumbang-server
npm run start
```

- 개발 실행시

```
npm install
cd auth-server
npm run start:dev
```
```
npm install
cd keumbang-server
npm run start:dev
```

### 기술 스택

<img src="https://img.shields.io/badge/TypeScript-version 5-3178C6">&nbsp;
<img src="https://img.shields.io/badge/Nest.js-version 10-E0234E">&nbsp;
<img src="https://img.shields.io/badge/TypeORM-version 0.3-fcad03">&nbsp;
<img src="https://img.shields.io/badge/MySQL-version 8-00758F">&nbsp;

### 프로젝트 관리

프로젝트 시작 전 만들어야 할 API를 노션 보드에 티켓으로 작성하고</br>
각각의 티켓 안에 요구사항들을 정리했으며, 티켓마다 이슈 생성하여 PR 생성하여 머지 진행

<details>
<summary>API 관리</summary>
<div markdown="1">
<img src="https://github.com/user-attachments/assets/45c86696-3a2e-4965-bbdb-cc28ae8d0845">
</div>
</details>

</br>

## ERD

<details>
<summary><strong>자원 서버 ERD</strong></summary>
<div markdown="1">
 
<img src="https://github.com/user-attachments/assets/f652da21-2dbb-4dfe-b030-a5973d164fe6">
</div>
</details>

<details>
<summary><strong>인증 서버 ERD</strong></summary>
<div markdown="1">
 
<img src="https://github.com/user-attachments/assets/bd61be3d-f29a-424e-975f-96111fbea3a9">
</div>
</details>


## 기능구현

### 회원가입

- 이메일 이메일 형식 유효성 체크
- 패스워드 특수문자, 대문자, 소문자 중 둘 이상 유효성 체크
- 패스워드 Bcrypt 암호화 처리

### 로그인

- 이메일, 패스워드 일치 여부 유효성 체크
- 로그인 시 JWT(Json Web Token) 발급(refresh token, access token) -> 모든 API 요청시 JWT 인가

### Access token 재발급

- db에 저장되어 있는 refresh token과 클라이언트가 주는 refresh token을 비교하여 새로운 access token을 발급

### 로그아웃

- refresh token을 db에서 삭제하여 로그아웃 진행

### 금 주문 목록

- 주문한 날짜, 보여줄 개수, 페이지, invoice type 에 따라 달라지는 주문 목록 구현


</br>

## API 명세

| No  | Title                               | Method  | Path                 | Authorization |
| --- | ----------------------------------- | :-----: | -------------------- | :-----------: |
| 1   | 회원가입                            | `POST`  | `/auth/sign-up`      |       X       |
| 2   | 로그인                              | `POST`  | `/auth/log-in`       |       X       |
| 3   | access token 재발급                  |  `POST`  | `/auth/refresh-token`     |       O       |
| 4   | 로그아웃                             | `POST` | `/auth/log-out`       |       O       |
| 5   | 아이템 목록                         |  `GET`  | `/items`              |       O       |
| 6   | 금 판매 등록                           |  `POST`  | `/orders/sales`      |       O       |
| 7   | 금 구매 등록                       |  `POST`  | `/orders/purchase`        |       O       |
| 8   | 금 주문 목록                         |  `GET`  | `/orders`    |       O       |
| 9   | 금 주문 상세 보기                           | `GET`  | `/orders/:id`            |       O       |
| 10  | 금 주문 수정                          | `PUT`  | `/orders/:id`            |       O       |
| 11  | 금 주문 상태 변경                       | `PATCH`  | `/orders/:id`            |       O       |
| 12  | 금 주문 삭제                         | `DELETE`  | `/orders/:id`            |       O       |

</br>

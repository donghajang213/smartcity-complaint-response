완벽하게 요청하신 대로 `README.md`에 넣을 수 있는 **설치 가이드 템플릿 (Markdown 형식)** 을 아래에 드립니다.
Tailwind 7-compat 버전 설치부터 `.env` 파일 생성까지 모두 포함되어 있습니다.

---

````markdown
# 🌌 Universe Frontend

> React + Vite + Tailwind 기반의 프론트엔드 프로젝트

---

## 🚀 프로젝트 실행 방법

### ✅ Node & npm 버전

```bash
node -v     # v20.11.1 이상 권장
npm -v      # v10.x 이상 권장
````

---

### ✅ 1. 의존성 설치

```bash
npm install -D tailwindcss@npm:@tailwindcss/postcss7-compat postcss autoprefixer
npm install
```

---

### ✅ 2. Tailwind 설정 초기화

```bash
npx tailwindcss init -p
```

> 아래 두 파일이 생성됩니다:
>
> * `tailwind.config.js`
> * `postcss.config.js`

---

### ✅ 3. .env 파일 생성

```bash
# .env 파일을 루트 디렉토리에 생성하고 아래 내용 추가
```

```
VITE_API_BASE_URL=http://localhost:8080
```

---

### ✅ 4. 개발 서버 실행

```bash
npm run dev
```

---

## 📦 주요 의존성 설치 명령어

```bash
npm install axios react react-dom react-router-dom
```

| 패키지명                 | 설명                  |
| -------------------- | ------------------- |
| `axios`              | HTTP 통신용 라이브러리      |
| `react`, `react-dom` | React 라이브러리         |
| `react-router-dom`   | SPA 라우팅 기능          |
| `tailwindcss`        | 유틸리티 기반 CSS 프레임워크   |
| `postcss`            | CSS 전처리 도구          |
| `autoprefixer`       | CSS 벤더 접두사 자동 추가 도구 |
| `vite`               | 빠른 빌드 및 개발 서버       |

npm install react-icons


---

## 📁 프로젝트 구조 (예시)

```plaintext
frontend/
├── public/
├── src/
│   ├── api/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🔗 배포 (Vercel)

* GitHub 연동 후 [https://vercel.com](https://vercel.com)에서 배포
* 빌드 명령어: `npm run build`
* 출력 디렉토리: `dist`

```

---

필요하시면 이걸 `README.md`에 그대로 붙여넣고 바로 푸시하시면 됩니다.  
다음은 로그인 구현이나 PR 생성 등으로 넘어갈까요? 😎
```

## reCAPTCHA, google계정 연동시 필요한 설치사항
---
    npm install @react-oauth/google
    npm install react-google-recaptcha
---    
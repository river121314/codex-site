# 안미연 서비스 기획 포트폴리오

포트폴리오 PDF의 내용을 바탕으로 제작한 한국어 우선 반응형 랜딩 페이지입니다.

## 구성

- Hero / About / Projects / Additional Info / Contact
- PC·모바일 반응형 레이아웃
- 스크롤 등장 효과와 타이핑 효과
- 빌드 과정이 필요 없는 정적 사이트

## 로컬 실행

`public` 폴더를 정적 서버로 실행합니다.

```bash
python -m http.server 4173 --directory public
```

## Vercel

루트의 `vercel.json`이 `public` 폴더를 배포 대상으로 지정합니다.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 최초 페이지

로고 화면이 뜬 후 1.5 초 뒤에 온보드 페이지로 이동.

## 온보드 페이지

상단 프로그레스 바가 상태 관리로 되는 성향질문 & 관심 책 선택 페이지.

# 메인 페이지

하단 탭으로 분리되어 있는 페이지.
layout으로 헤더와 footer 탭을 넣으면 된다.

## 기본 메인 페이지

카드가 보이고 스와이프가 가능하도록 하는 페이지
본인 성향의 사람들이 작성한 책만 뜬다.

## 다른 성향 사람들의 페이지

위와 같지만 다른 성향의 사람들의 추천 책만 뜬다.

## 물물교환 등록 페이지

책을 등록해서 자신의 후기 등 입력해서 등록할 수 있는 페이지

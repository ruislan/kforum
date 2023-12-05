# KForum

A simple and modern forum.

![screenshot](./docs/screenshot.png)

## Build With

* Framework: NextJS
* Database: MySQL(^v0.6.0)
* ORM: Prisma
* Auth: Next Auth
* State: Zustand
* Styling: Tailwind CSS、Headless UI
* Editor: TipTap

## Running Locally

1. Running MySQL first
2. Rename .env.example to .env
3. Set the property DATABASE_URL

```shell
cd kforum
pnpm install
pnpm prisma db push
pnpm seed:dev
pnpm dev
```

admin user:

```text
user: admin
pass: 123123
```

## Running Docker

```shell
docker compose up -d
```

that's all, enjoy.

## Other

NextJS is amazing, you can build a website instantly. If your website is growing big, you can easily rewrite your backend services in any other languages (Java, Go, Rust, etc...).

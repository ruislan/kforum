# KForum

A Simple, Modern, Beautiful and Fast Forum.

![screenshot](./docs/screenshot.png)

* Framework: NextJS
* Database: Sqlite
* ORM: Prisma
* Auth: Next Auth
* State: Zustand
* Styling: NextUI、Tailwind CSS、Headless UI

## Running Locally

Rename .env.example to .env

```shell
cd kforum
pnpm install
pnpm prisma db push
pnpm prisma db seed
pnpm dev
```

admin user:

```text
user: admin
pass: 123123
```

## Other

NextJS is amazing, you can build a website instantly. And if your website is growing big, you can easily rewrite your backend logic in any other languages(Java, Go, Rust).

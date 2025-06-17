# KForum

一个简单又现代的论坛.

![screenshot](./docs/screenshot.png)

## 构建于

* 框架: NextJS
* 数据库: MySQL（v0.6.0版本之前是 SQLite）
* ORM: Prisma
* 认证: Next Auth
* 状态: Zustand
* 样式: Tailwind CSS、Headless UI
* 文本编辑器: TipTap

## 本地运行

1. 首先运行 MySQL，并创建数据库 kforum
2. 重命名 .env.example 为 .env
3. 设置 DATABASE_URL 为MySQL 的地址

```shell
cd kforum
pnpm install
pnpm prisma db push
pnpm seed:dev
pnpm dev
```

管理员账号:

```text
user: admin
pass: 123123
```

## Docker 中运行

1. 重命名 .env.example 为 .env

```shell
docker compose up -d
```

可以愉快的玩耍了。

值得注意的是，如果要在正式环境部署，每次更新时注意备份数据库。

## 其他

NextJS 非常棒，可以快速帮助你建立起一个站点或者应用。如果你的站点变得越来越牛，你可以很容易用你喜欢的语言（例如Java，Go，Rust等等）重写你的后台服务。

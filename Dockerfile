FROM node:20-alpine
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apk add --no-cache libc6-compat curl

WORKDIR /app
COPY . .
COPY scripts/cronjobs /etc/crontabs/root
RUN yarn global add pnpm && pnpm i --frozen-lockfile

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD crond && pnpm prisma db push && pnpm seed:base && pnpm build && pnpm start
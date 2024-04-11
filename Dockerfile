FROM oven/bun:latest
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apk add --no-cache libc6-compat curl

WORKDIR /app
COPY . .
COPY scripts/cronjobs /etc/crontabs/root
RUN bun install --frozen-lockfile

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD crond && bun prisma db push && bun seed:base && bun run build && bun run start

FROM node:20-alpine  

# OpenSSL 설치
RUN apk add openssl

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN npm install -g corepack@latest
RUN corepack enable pnpm && pnpm i --frozen-lockfile

COPY . .

RUN npx prisma generate

EXPOSE 3001
ENV PORT 3001
RUN npm run build
CMD [ "npm", "run", "start" ]
FROM node:20-slim  

# OpenSSL 설치
RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*

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
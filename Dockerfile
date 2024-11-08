# Dockerfile do frontend

# Etapa de construção
FROM node:18 AS builder

WORKDIR /app

# Copia os arquivos do frontend
COPY . .

# Instala as dependências e cria o build
RUN npm install
RUN npm run build

# Etapa final
FROM node:18

WORKDIR /app

# Copia os arquivos de build para o diretório atual
COPY --from=builder /app/dist /app/dist

# Expondo a porta padrão para o frontend (alterar se necessário)
EXPOSE 3000:3000

# Comando para iniciar o servidor de produção
CMD ["npx", "serve", "-s", "dist", "-p", "3000"]

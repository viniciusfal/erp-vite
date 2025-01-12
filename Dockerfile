# Etapa de build
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

# Instala o servidor HTTP para servir os arquivos estáticos
RUN npm install -g serve

# Expondo a porta padrão para o frontend (alterar se necessário)
EXPOSE 3000

# Comando para iniciar o servidor de produção
CMD ["serve", "-s", "dist", "-l", "3000"]
FROM node:21-alpine

WORKDIR /code/frontend

# Copy package.json
COPY ./package*.json .

# Install dependencies
RUN npm ci

# Copy the rest content of the frontend directory
COPY . .

# Build the frontend
RUN npm run build

ENTRYPOINT ["npm", "run"]
CMD ["preview"]
# build:
# docker build -t uhwgmxorg/my-m-to-n-relation-app-postgresql-docker-image:0.0.0 .
# start
# docker run --name my-m-to-n-container -p 3000:3000 -p 5432:5432 -e POSTGRES_USER=m_to_n_user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mydb -d uhwgmxorg/my-m-to-n-relation-app-postgresql-docker-image:0.0.0
# Using the official postgres:16 image as a base
FROM postgres:16

# Install necessary packages for Node.js
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install TypeScript and ts-node (optional)
RUN npm install -g typescript ts-node

# Check the installed versions of Node.js and npm
RUN node -v && npm -v

# Copy the SQL script into the /docker-entrypoint-initdb.d/ directory
COPY init_create_schema_and_table.sql /docker-entrypoint-initdb.d/init_create_schema_and_table.sql
COPY init_insert_objects.sql  /docker-entrypoint-initdb.d/init_insert_objects.sql

# Copy package.json and package-lock.json
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY prisma/schema.prisma ./
COPY api-types.ts ./
COPY config.ts ./
COPY postgresqlDataService.ts ./
COPY server.ts ./ 
COPY .env /app   

# Install dependencies
RUN npm install
RUN npm install -g prisma
RUN prisma generate

# Compile TypeScript files to JavaScript
RUN npm run build

# Copy the start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
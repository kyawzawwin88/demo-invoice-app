# Use a base image that has both Node.js and MySQL
FROM debian:bullseye-slim

# Install MySQL server and client
RUN apt-get update && \
    apt-get install -y \
    curl \
    gnupg \
    default-mysql-server \
    default-mysql-client && \
    # Add Node.js repository
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    # Clean up
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set up MySQL
ENV DB_PASSWORD=set_production_password_here
ENV DB_NAME=invoicing_app

COPY mysql_schema_seeder.sql /mysql_schema_seeder.sql
# Create directory for MySQL data
RUN mkdir -p /var/lib/mysql && \
  # Start MySQL temporarily to set root password
  mysqld_safe & \
  sleep 5 && \
  mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';" && \
  mysql -u root -p"${DB_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};" && \
  mysql -u root -p"${DB_PASSWORD}" ${DB_NAME} < /mysql_schema_seeder.sql && \
  # Stop MySQL
  mysqladmin -u root -p"${DB_PASSWORD}" shutdown

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Copy wait script and make it executable
COPY wait-for-mysql.sh /app/wait-for-mysql.sh
RUN chmod +x /app/wait-for-mysql.sh

# Expose ports
EXPOSE 3000
EXPOSE 3306

RUN echo '#!/bin/sh\n\
mysqld_safe & \n\
/app/wait-for-mysql.sh localhost \n\
npm run start:prod\n\
' > /app/start.sh && chmod +x /app/start.sh

# Start both MySQL and Node.js app
CMD ["/app/start.sh"]

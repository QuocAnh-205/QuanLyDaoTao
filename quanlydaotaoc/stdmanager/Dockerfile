# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy Maven POM and cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and package the jar
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Spring Boot default port, Render will automatically map this or use SERVER_PORT
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
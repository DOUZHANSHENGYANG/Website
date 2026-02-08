FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /build

COPY pom.xml .
COPY src ./src

RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /build/target/blog-backend-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir -p /app/data /app/storage

ENV BLOG_DB_PATH=/app/data/blog.db
ENV BLOG_STORAGE_PATH=/app/storage
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

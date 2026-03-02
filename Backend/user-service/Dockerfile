# Stage 1: Build the app
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /build

COPY Backend ./Backend
COPY pom.xml ./pom.xml

RUN mvn -pl Backend/user-service -am clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /build/Backend/user-service/target/*.jar app.jar

EXPOSE 8096

ENTRYPOINT ["java", "-jar", "app.jar"]
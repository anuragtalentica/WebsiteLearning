# ── Stage 1: Build ──────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files first (for layer caching)
COPY src/ExamPrep.Domain/ExamPrep.Domain.csproj             src/ExamPrep.Domain/
COPY src/ExamPrep.Application/ExamPrep.Application.csproj   src/ExamPrep.Application/
COPY src/ExamPrep.Infrastructure/ExamPrep.Infrastructure.csproj src/ExamPrep.Infrastructure/
COPY src/ExamPrep.API/ExamPrep.API.csproj                   src/ExamPrep.API/

# Restore dependencies
RUN dotnet restore src/ExamPrep.API/ExamPrep.API.csproj

# Copy all source code
COPY . .

# Publish release build
RUN dotnet publish src/ExamPrep.API/ExamPrep.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ── Stage 2: Runtime ─────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/publish .

# Koyeb routes traffic to port 8080
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "ExamPrep.API.dll"]

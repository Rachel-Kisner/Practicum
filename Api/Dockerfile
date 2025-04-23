# שלב בסיסי להרצת האפליקציה
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# שלב בנייה
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# העתקת קבצי הפרויקטים מהשכבות
COPY PlaySync/PlaySyncApi.csproj PlaySync/
COPY BL/BL.csproj BL/
COPY DL/DL.csproj DL/

# שחזור תלויות
RUN dotnet restore PlaySync/PlaySyncApi.csproj

# העתקת שאר קבצי הקוד
COPY .. .

# בניית הפרויקט
WORKDIR /src/PlaySync
RUN dotnet build PlaySyncApi.csproj -c $BUILD_CONFIGURATION -o /app/build

# שלב פרסום (Publish)
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish PlaySyncApi.csproj -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# שלב הריצה הסופי
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PlaySyncApi.dll"]

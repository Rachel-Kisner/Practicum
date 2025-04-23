# שלב 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# העתקת קובץ הסולושן והפרויקטים
COPY PlaySync.sln ./
COPY DL/DL.csproj ./DL/
COPY BL/BL.csproj ./BL/
COPY PlaySync/PlaySync.csproj ./PlaySync/

# שחזור חבילות NuGet
RUN dotnet restore

# העתקת שאר הקבצים
COPY ./DL ./DL/
COPY ./BL ./BL/
COPY ./PlaySync ./PlaySync/

# פרסום (Publish) של ה-API
WORKDIR /app/PlaySync
RUN dotnet publish -c Release -o /app/out

# שלב 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/out ./

EXPOSE 80

ENTRYPOINT ["dotnet", "PlaySyncApi.dll"]
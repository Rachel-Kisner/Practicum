FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# העתקת קבצי הפרויקט
COPY BL/BL.csproj ./BL/
COPY DL/DL.csproj ./DL/
COPY PlaySync/PlaySyncApi.csproj ./PlaySync/

# שחזור תלויות (NuGet) עבור כל פרויקט בנפרד
RUN dotnet restore ./BL/BL.csproj
RUN dotnet restore ./DL/DL.csproj
RUN dotnet restore ./PlaySync/PlaySyncApi.csproj

# העתקת כל קוד הפרויקט
COPY BL ./BL/
COPY DL ./DL/
COPY PlaySync ./PlaySync/

# פרסום האפליקציה - מציין את הפרויקט במפורש
RUN dotnet publish ./PlaySync/PlaySyncApi.csproj -c Release -o /app/out

# ----------------------------------------------------------------------------------------------------
# שלב 2: הפעלה (Runtime)
# ----------------------------------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./
ENTRYPOINT ["dotnet", "PlaySyncApi.dll"]

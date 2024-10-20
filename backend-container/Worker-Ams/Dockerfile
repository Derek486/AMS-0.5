FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Worker-Ams/Worker-Ams.csproj", "Worker-Ams/"]
RUN dotnet restore "./Worker-Ams/Worker-Ams.csproj"
COPY . .
WORKDIR "/src/Worker-Ams"
RUN dotnet build "./Worker-Ams.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Worker-Ams.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Worker-Ams.dll"]
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY apps/api/PolicyClaim.Api.csproj apps/api/
RUN dotnet restore apps/api/PolicyClaim.Api.csproj
COPY apps/api apps/api
RUN dotnet publish apps/api/PolicyClaim.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "PolicyClaim.Api.dll"]

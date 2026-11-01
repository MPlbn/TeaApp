#BUILD
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["TeaApp.Api.csproj", "./"]
RUN dotnet restore "TeaApp.Api.csproj"

COPY . .
RUN dotnet publish "TeaApp.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

#RUN
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libgssapi-krb5-2 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/DataProtection-Keys

COPY --from=build /app/publish .
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "TeaApp.Api.dll"]

# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["APIGatewayService/APIGatewayService.csproj", "./"]
RUN dotnet restore "APIGatewayService.csproj"

# Copy the remaining project files and build the application
COPY . .
RUN dotnet build "APIGatewayService.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "APIGatewayService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official ASP.NET Core runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose the port the application listens on
EXPOSE 80

# Set the entry point for the application
ENTRYPOINT ["dotnet", "APIGatewayService.dll"]

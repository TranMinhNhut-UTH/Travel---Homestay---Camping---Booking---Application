using Microsoft.AspNetCore.Builder;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.Extensions.Configuration; // Add this for ConfigurationBuilder

var builder = WebApplication.CreateBuilder(args);

// Create an in-memory configuration for Ocelot
var ocelotConfiguration = new ConfigurationBuilder()
    .AddInMemoryCollection(new Dictionary<string, string?>
    {
        { "Routes:0:UpstreamPathTemplate", "/api/users/{everything}" },
        { "Routes:0:UpstreamHttpMethod:0", "GET" },
        { "Routes:0:UpstreamHttpMethod:1", "POST" },
        { "Routes:0:UpstreamHttpMethod:2", "PUT" },
        { "Routes:0:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:0:DownstreamPathTemplate", "/api/users/{everything}" },
        { "Routes:0:DownstreamScheme", "http" },
        { "Routes:0:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:0:DownstreamHostAndPorts:0:Port", "7001" },

        { "Routes:1:UpstreamPathTemplate", "/api/Orders" },
        { "Routes:1:UpstreamHttpMethod:0", "GET" },
        { "Routes:1:DownstreamPathTemplate", "/api/Orders" },
        { "Routes:1:DownstreamScheme", "http" },
        { "Routes:1:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:1:DownstreamHostAndPorts:0:Port", "5003" },

        { "Routes:2:UpstreamPathTemplate", "/api/vehicles/{everything}" },
        { "Routes:2:UpstreamHttpMethod:0", "GET" },
        { "Routes:2:UpstreamHttpMethod:1", "POST" },
        { "Routes:2:UpstreamHttpMethod:2", "PUT" },
        { "Routes:2:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:2:DownstreamPathTemplate", "/api/vehicles/{everything}" },
        { "Routes:2:DownstreamScheme", "http" },
        { "Routes:2:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:2:DownstreamHostAndPorts:0:Port", "5068" }, // Updated port for VehicleService

        { "Routes:3:UpstreamPathTemplate", "/api/customers/{everything}" },
        { "Routes:3:UpstreamHttpMethod:0", "GET" },
        { "Routes:3:UpstreamHttpMethod:1", "POST" },
        { "Routes:3:UpstreamHttpMethod:2", "PUT" },
        { "Routes:3:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:3:DownstreamPathTemplate", "/api/customers/{everything}" },
        { "Routes:3:DownstreamScheme", "http" },
        { "Routes:3:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:3:DownstreamHostAndPorts:0:Port", "5039" }, // Updated port for CustomerService

        // New route for authentication service
        { "Routes:4:UpstreamPathTemplate", "/api/auth/{everything}" },
        { "Routes:4:UpstreamHttpMethod:0", "GET" },
        { "Routes:4:UpstreamHttpMethod:1", "POST" },
        { "Routes:4:UpstreamHttpMethod:2", "PUT" },
        { "Routes:4:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:4:DownstreamPathTemplate", "/api/auth/{everything}" },
        { "Routes:4:DownstreamScheme", "http" },
        { "Routes:4:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:4:DownstreamHostAndPorts:0:Port", "7001" }, // Assuming auth service runs on port 7001 (User Service)

        // New route for getting a single order
        { "Routes:5:UpstreamPathTemplate", "/api/Orders/{orderId}" },
        { "Routes:5:UpstreamHttpMethod:0", "GET" },
        { "Routes:5:DownstreamPathTemplate", "/api/Orders/{orderId}" },
        { "Routes:5:DownstreamScheme", "http" },
        { "Routes:5:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:5:DownstreamHostAndPorts:0:Port", "5003" },

        // New route for Contracts
        { "Routes:6:UpstreamPathTemplate", "/api/Contracts" },
        { "Routes:6:UpstreamHttpMethod:0", "POST" },
        { "Routes:6:DownstreamPathTemplate", "/api/Contracts" },
        { "Routes:6:DownstreamScheme", "http" },
        { "Routes:6:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:6:DownstreamHostAndPorts:0:Port", "5003" },

        // New route for getting a single contract
        { "Routes:7:UpstreamPathTemplate", "/api/Contracts/{contractId}" },
        { "Routes:7:UpstreamHttpMethod:0", "GET" },
        { "Routes:7:DownstreamPathTemplate", "/api/Contracts/{contractId}" },
        { "Routes:7:DownstreamScheme", "http" },
        { "Routes:7:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:7:DownstreamHostAndPorts:0:Port", "5003" },

        // New route for updating contract status
        { "Routes:8:UpstreamPathTemplate", "/api/Contracts/{contractId}/status" },
        { "Routes:8:UpstreamHttpMethod:0", "PUT" },
        { "Routes:8:DownstreamPathTemplate", "/api/Contracts/{contractId}/status" },
        { "Routes:8:DownstreamScheme", "http" },
        { "Routes:8:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:8:DownstreamHostAndPorts:0:Port", "5003" },

        // New route for updating order status
        { "Routes:9:UpstreamPathTemplate", "/api/Orders/{orderId}/status" },
        { "Routes:9:UpstreamHttpMethod:0", "PUT" },
        { "Routes:9:DownstreamPathTemplate", "/api/Orders/{orderId}/status" },
        { "Routes:9:DownstreamScheme", "http" },
        { "Routes:9:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:9:DownstreamHostAndPorts:0:Port", "5003" },

        // New route for TestDrives by customer ID
        { "Routes:10:UpstreamPathTemplate", "/api/TestDrives/customer/{customerId}" },
        { "Routes:10:UpstreamHttpMethod:0", "GET" },
        { "Routes:10:DownstreamPathTemplate", "/api/TestDrives/customer/{customerId}" },
        { "Routes:10:DownstreamScheme", "http" },
        { "Routes:10:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:10:DownstreamHostAndPorts:0:Port", "5039" }, // CustomerService port

        // New route for creating TestDrives
        { "Routes:11:UpstreamPathTemplate", "/api/TestDrives" },
        { "Routes:11:UpstreamHttpMethod:0", "POST" },
        { "Routes:11:DownstreamPathTemplate", "/api/TestDrives" },
        { "Routes:11:DownstreamScheme", "http" },
        { "Routes:11:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:11:DownstreamHostAndPorts:0:Port", "5039" }, // CustomerService port

        // New route for getting all TestDrives
        { "Routes:12:UpstreamPathTemplate", "/api/TestDrives" },
        { "Routes:12:UpstreamHttpMethod:0", "GET" },
        { "Routes:12:DownstreamPathTemplate", "/api/TestDrives" },
        { "Routes:12:DownstreamScheme", "http" },
        { "Routes:12:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:12:DownstreamHostAndPorts:0:Port", "5039" }, // CustomerService port

        // NEW ROUTE FOR COMPLAINTS
        { "Routes:13:UpstreamPathTemplate", "/api/CustomerService/Complaints/{everything}" },
        { "Routes:13:UpstreamHttpMethod:0", "GET" },
        { "Routes:13:UpstreamHttpMethod:1", "POST" },
        { "Routes:13:UpstreamHttpMethod:2", "PUT" },
        { "Routes:13:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:13:DownstreamPathTemplate", "/api/Complaints/{everything}" },
        { "Routes:13:DownstreamScheme", "http" },
        { "Routes:13:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:13:DownstreamHostAndPorts:0:Port", "5039" }, // CustomerService port

        // New route for /api/dealers
        { "Routes:14:UpstreamPathTemplate", "/api/dealers" },
        { "Routes:14:UpstreamHttpMethod:0", "GET" },
        { "Routes:14:DownstreamPathTemplate", "/api/dealers" },
        { "Routes:14:DownstreamScheme", "http" },
        { "Routes:14:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:14:DownstreamHostAndPorts:0:Port", "5004" }, // Assuming DealerService runs on port 5004

        // New route for /api/vehicletypes
        { "Routes:15:UpstreamPathTemplate", "/api/vehicletypes" },
        { "Routes:15:UpstreamHttpMethod:0", "GET" },
        { "Routes:15:DownstreamPathTemplate", "/api/vehicletypes" },
        { "Routes:15:DownstreamScheme", "http" },
        { "Routes:15:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:15:DownstreamHostAndPorts:0:Port", "5068" }, // Assuming VehicleService handles vehicletypes

        // New route for images
        { "Routes:16:UpstreamPathTemplate", "/images/{everything}" },
        { "Routes:16:UpstreamHttpMethod:0", "GET" },
        { "Routes:16:DownstreamPathTemplate", "/images/{everything}" },
        { "Routes:16:DownstreamScheme", "http" },
        { "Routes:16:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:16:DownstreamHostAndPorts:0:Port", "5068" }, // Assuming VehicleService serves images

        // NEW ROUTE FOR ADMIN USERS (specific POST /api/admin/users) - Placed first for priority
        { "Routes:17:UpstreamPathTemplate", "/api/admin/users" },
        { "Routes:17:UpstreamHttpMethod:0", "POST" },
        { "Routes:17:DownstreamPathTemplate", "/api/admin/users" },
        { "Routes:17:DownstreamScheme", "http" },
        { "Routes:17:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:17:DownstreamHostAndPorts:0:Port", "7001" }, // Assuming User Service handles admin users

        // NEW ROUTE FOR ADMIN USERS (general, e.g., GET /api/admin/users/{id}, PUT, DELETE)
        { "Routes:18:UpstreamPathTemplate", "/api/admin/users/{everything}" },
        { "Routes:18:UpstreamHttpMethod:0", "GET" },
        { "Routes:18:UpstreamHttpMethod:1", "PUT" },
        { "Routes:18:UpstreamHttpMethod:2", "DELETE" },
        { "Routes:18:DownstreamPathTemplate", "/api/admin/users/{everything}" },
        { "Routes:18:DownstreamScheme", "http" },
        { "Routes:18:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:18:DownstreamHostAndPorts:0:Port", "7001" }, // Assuming User Service handles admin users

        { "GlobalConfiguration:BaseUrl", "http://localhost:5036" }
    })
    .Build();

// Add Ocelot configuration from the in-memory configuration
builder.Services.AddOcelot(ocelotConfiguration);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            // Allow common dev ports used by Vite (5173, 5174, 5175)
            policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS - This must be before UseOcelot()
app.UseCors("AllowFrontend");

// Use Ocelot middleware
await app.UseOcelot();

app.Run();

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

        // Route for completing orders (Module C - Sales Core)
        { "Routes:2:UpstreamPathTemplate", "/api/Orders/complete" },
        { "Routes:2:UpstreamHttpMethod:0", "POST" },
        { "Routes:2:DownstreamPathTemplate", "/api/Orders/complete" },
        { "Routes:2:DownstreamScheme", "http" },
        { "Routes:2:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:2:DownstreamHostAndPorts:0:Port", "5003" },

        { "Routes:3:UpstreamPathTemplate", "/api/vehicles/{everything}" },
        { "Routes:3:UpstreamHttpMethod:0", "GET" },
        { "Routes:3:UpstreamHttpMethod:1", "POST" },
        { "Routes:3:UpstreamHttpMethod:2", "PUT" },
        { "Routes:3:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:3:DownstreamPathTemplate", "/api/vehicles/{everything}" },
        { "Routes:3:DownstreamScheme", "http" },
        { "Routes:3:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:3:DownstreamHostAndPorts:0:Port", "5068" }, // VehicleService

        // Route 4: Dành riêng cho các action trên tập hợp gốc (Thêm mới Customer & Lấy danh sách)
        { "Routes:4:UpstreamPathTemplate", "/api/customers" },
        { "Routes:4:UpstreamHttpMethod:0", "GET" },
        { "Routes:4:UpstreamHttpMethod:1", "POST" },
        { "Routes:4:DownstreamPathTemplate", "/api/customers" },
        { "Routes:4:DownstreamScheme", "http" },
        { "Routes:4:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:4:DownstreamHostAndPorts:0:Port", "5039" }, 
        { "Routes:4:AuthenticationOptions:AuthenticationProviderKey", "JwtBearer" },


        // Route for authentication service
        { "Routes:5:UpstreamPathTemplate", "/api/auth/{everything}" },
        { "Routes:5:UpstreamHttpMethod:0", "GET" },
        { "Routes:5:UpstreamHttpMethod:1", "POST" },
        { "Routes:5:UpstreamHttpMethod:2", "PUT" },
        { "Routes:5:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:5:DownstreamPathTemplate", "/api/auth/{everything}" },
        { "Routes:5:DownstreamScheme", "http" },
        { "Routes:5:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:5:DownstreamHostAndPorts:0:Port", "7001" }, // UserService

        // Route for getting a single order
        { "Routes:6:UpstreamPathTemplate", "/api/Orders/{orderId}" },
        { "Routes:6:UpstreamHttpMethod:0", "GET" },
        { "Routes:6:DownstreamPathTemplate", "/api/Orders/{orderId}" },
        { "Routes:6:DownstreamScheme", "http" },
        { "Routes:6:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:6:DownstreamHostAndPorts:0:Port", "5003" },

        // Route for Contracts
        { "Routes:7:UpstreamPathTemplate", "/api/Contracts" },
        { "Routes:7:UpstreamHttpMethod:0", "POST" },
        { "Routes:7:DownstreamPathTemplate", "/api/Contracts" },
        { "Routes:7:DownstreamScheme", "http" },
        { "Routes:7:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:7:DownstreamHostAndPorts:0:Port", "5003" },

        // Route for getting a single contract
        { "Routes:8:UpstreamPathTemplate", "/api/Contracts/{contractId}" },
        { "Routes:8:UpstreamHttpMethod:0", "GET" },
        { "Routes:8:DownstreamPathTemplate", "/api/Contracts/{contractId}" },
        { "Routes:8:DownstreamScheme", "http" },
        { "Routes:8:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:8:DownstreamHostAndPorts:0:Port", "5003" },

        // Route for updating contract status
        { "Routes:9:UpstreamPathTemplate", "/api/Contracts/{contractId}/status" },
        { "Routes:9:UpstreamHttpMethod:0", "PUT" },
        { "Routes:9:DownstreamPathTemplate", "/api/Contracts/{contractId}/status" },
        { "Routes:9:DownstreamScheme", "http" },
        { "Routes:9:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:9:DownstreamHostAndPorts:0:Port", "5003" },

        // Route for updating order status
        { "Routes:10:UpstreamPathTemplate", "/api/Orders/{orderId}/status" },
        { "Routes:10:UpstreamHttpMethod:0", "PUT" },
        { "Routes:10:DownstreamPathTemplate", "/api/Orders/{orderId}/status" },
        { "Routes:10:DownstreamScheme", "http" },
        { "Routes:10:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:10:DownstreamHostAndPorts:0:Port", "5003" },

        // Route for TestDrives by customer ID
        { "Routes:11:UpstreamPathTemplate", "/api/TestDrives/customer/{customerId}" },
        { "Routes:11:UpstreamHttpMethod:0", "GET" },
        { "Routes:11:DownstreamPathTemplate", "/api/TestDrives/customer/{customerId}" },
        { "Routes:11:DownstreamScheme", "http" },
        { "Routes:11:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:11:DownstreamHostAndPorts:0:Port", "5039" }, // CustomerService
        { "Routes:11:AuthenticationOptions:AuthenticationProviderKey", "JwtBearer" },

        // Route for creating TestDrives
        { "Routes:12:UpstreamPathTemplate", "/api/TestDrives" },
        { "Routes:12:UpstreamHttpMethod:0", "POST" },
        { "Routes:12:DownstreamPathTemplate", "/api/TestDrives" },
        { "Routes:12:DownstreamScheme", "http" },
        { "Routes:12:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:12:DownstreamHostAndPorts:0:Port", "5039" }, // CustomerService
        { "Routes:12:AuthenticationOptions:AuthenticationProviderKey", "JwtBearer" },

        // Route for getting all TestDrives
        { "Routes:13:UpstreamPathTemplate", "/api/TestDrives" },
        { "Routes:13:UpstreamHttpMethod:0", "GET" },
        { "Routes:13:DownstreamPathTemplate", "/api/TestDrives" },
        { "Routes:13:DownstreamScheme", "http" },
        { "Routes:13:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:13:DownstreamHostAndPorts:0:Port", "5039" }, // CustomerService
        { "Routes:13:AuthenticationOptions:AuthenticationProviderKey", "JwtBearer" },

        // Route for Complaints (CustomerService)
        { "Routes:14:UpstreamPathTemplate", "/api/CustomerService/Complaints/{everything}" },
        { "Routes:14:UpstreamHttpMethod:0", "GET" },
        { "Routes:14:UpstreamHttpMethod:1", "POST" },
        { "Routes:14:UpstreamHttpMethod:2", "PUT" },
        { "Routes:14:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:14:DownstreamPathTemplate", "/api/Complaints/{everything}" },
        { "Routes:14:DownstreamScheme", "http" },
        { "Routes:14:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:14:DownstreamHostAndPorts:0:Port", "5039" }, // CustomerService

        // Route for /api/dealers (GET + POST) -> VehicleService exposes dealer endpoints
        { "Routes:15:UpstreamPathTemplate", "/api/dealers" },
        { "Routes:15:UpstreamHttpMethod:0", "GET" },
        { "Routes:15:UpstreamHttpMethod:1", "POST" },
        { "Routes:15:DownstreamPathTemplate", "/api/dealers" },
        { "Routes:15:DownstreamScheme", "http" },
        { "Routes:15:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:15:DownstreamHostAndPorts:0:Port", "5068" }, // VehicleService handles dealer endpoints

        // Route for /api/dealers/{id} (GET + PUT + DELETE)
        { "Routes:16:UpstreamPathTemplate", "/api/dealers/{everything}" },
        { "Routes:16:UpstreamHttpMethod:0", "GET" },
        { "Routes:16:UpstreamHttpMethod:1", "PUT" },
        { "Routes:16:UpstreamHttpMethod:2", "DELETE" },
        { "Routes:16:DownstreamPathTemplate", "/api/dealers/{everything}" },
        { "Routes:16:DownstreamScheme", "http" },
        { "Routes:16:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:16:DownstreamHostAndPorts:0:Port", "5068" }, // VehicleService handles dealer endpoints

        // Route for /api/vehicletypes
        { "Routes:17:UpstreamPathTemplate", "/api/vehicletypes" },
        { "Routes:17:UpstreamHttpMethod:0", "GET" },
        { "Routes:17:DownstreamPathTemplate", "/api/vehicletypes" },
        { "Routes:17:DownstreamScheme", "http" },
        { "Routes:17:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:17:DownstreamHostAndPorts:0:Port", "5068" }, // VehicleService handles vehicletypes

        // Route for static images
        { "Routes:18:UpstreamPathTemplate", "/images/{everything}" },
        { "Routes:18:UpstreamHttpMethod:0", "GET" },
        { "Routes:18:DownstreamPathTemplate", "/images/{everything}" },
        { "Routes:18:DownstreamScheme", "http" },
        { "Routes:18:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:18:DownstreamHostAndPorts:0:Port", "5068" }, // VehicleService serves images

        // Health check route via API Gateway -> VehicleService /api/health
        { "Routes:19:UpstreamPathTemplate", "/api/health" },
        { "Routes:19:UpstreamHttpMethod:0", "GET" },
        { "Routes:19:DownstreamPathTemplate", "/api/health" },
        { "Routes:19:DownstreamScheme", "http" },
        { "Routes:19:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:19:DownstreamHostAndPorts:0:Port", "5068" },

        // Route for admin users (specific POST /api/admin/users)
        { "Routes:20:UpstreamPathTemplate", "/api/admin/users" },
        { "Routes:20:UpstreamHttpMethod:0", "POST" },
        { "Routes:20:DownstreamPathTemplate", "/api/admin/users" },
        { "Routes:20:DownstreamScheme", "http" },
        { "Routes:20:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:20:DownstreamHostAndPorts:0:Port", "7001" }, // UserService handles admin users
        { "Routes:20:AuthenticationOptions:AuthenticationProviderKey", "JwtBearer" },

        // Route for admin users (general: GET /api/admin/users/{id}, PUT, DELETE)
        { "Routes:21:UpstreamPathTemplate", "/api/admin/users/{everything}" },
        { "Routes:21:UpstreamHttpMethod:0", "GET" },
        { "Routes:21:UpstreamHttpMethod:1", "PUT" },
        { "Routes:21:UpstreamHttpMethod:2", "DELETE" },
        { "Routes:21:DownstreamPathTemplate", "/api/admin/users/{everything}" },
        { "Routes:21:DownstreamScheme", "http" },
        { "Routes:21:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:21:DownstreamHostAndPorts:0:Port", "7001" }, // UserService handles admin users
        { "Routes:21:AuthenticationOptions:AuthenticationProviderKey", "JwtBearer" },
        
        { "Routes:22:UpstreamPathTemplate", "/api/customers/{id}" },
        { "Routes:22:UpstreamHttpMethod:0", "GET" },
        { "Routes:22:UpstreamHttpMethod:1", "PUT" },
        { "Routes:22:UpstreamHttpMethod:2", "DELETE" },
        { "Routes:22:DownstreamPathTemplate", "/api/customers/{id}" },
        { "Routes:22:DownstreamScheme", "http" },
        { "Routes:22:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:22:DownstreamHostAndPorts:0:Port", "5039" }, 
        { "Routes:22:AuthenticationOptions:AuthenticationProviderKey", "JwtBearer" },
        
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

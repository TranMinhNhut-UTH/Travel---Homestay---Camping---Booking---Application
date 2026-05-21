using Microsoft.EntityFrameworkCore;
using VehicleService.Data;
using VehicleService.Services;
using VehicleService.Messaging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IVehicleService, VehicleService.Services.VehicleService>();

// Existing vehicle event producer (used inside VehicleService)
builder.Services.AddSingleton<VehicleService.Services.IMessageProducer, VehicleService.Services.RabbitMQProducerService>();

// Reservation event producer (used by ReservationsController)
builder.Services.AddSingleton<VehicleService.Messaging.IMessageProducer, VehicleService.Messaging.RabbitMQProducer>();

builder.Services.AddHealthChecks();

// REMOVED: Add CORS services
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowFrontend", policy => // Changed policy name to be more generic
//     {
//         policy.WithOrigins("http://localhost:5173", "http://localhost:5174") // Allow both frontend and potentially VehicleService itself
//               .AllowAnyMethod()
//               .AllowAnyHeader()
//               .AllowCredentials();
//     });
// });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// REMOVED: Use CORS policy
// app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.MapControllers();
app.MapHealthChecks("/health");

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

app.Run();

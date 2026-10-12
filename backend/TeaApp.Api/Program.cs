using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddControllers();

builder.Services.AddDbContext<TeaDbContext>
(xOptions => xOptions.UseNpgsql(
    builder.Configuration.GetConnectionString("TeaDatabase")
));

builder.Services.AddCors(options =>
{
    options.AddPolicy("TeaAppPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    }); 
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(xOptions =>
    {
       xOptions.SwaggerEndpoint("/openapi/v1.json", "TeaApp API v1"); 
    });
}

app.UseCors("TeaAppPolicy");

app.MapControllers();

app.UseHttpsRedirection();

app.Run();
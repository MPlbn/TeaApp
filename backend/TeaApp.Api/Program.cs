using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using DotNetEnv;


Env.Load("../../.env");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<TeaDbContext>
(xOptions => xOptions.UseNpgsql(
    builder.Configuration.GetConnectionString("TeaDatabase")
));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();
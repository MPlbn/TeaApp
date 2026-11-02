using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TeaApp.Api.Data;
using TeaApp.Api.Models;
using TeaApp.Api.Services;
using Microsoft.AspNetCore.DataProtection;
using System.Security.Cryptography.X509Certificates;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddControllers();

builder.Services.AddScoped<TokenService>();

builder.Services.AddDbContext<TeaDbContext>
(options => options.UseNpgsql(
    builder.Configuration.GetConnectionString("TeaDatabase")
));

builder.Services
    .AddIdentityCore<ApplicationUser>(options => options.User.RequireUniqueEmail = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<TeaDbContext>();

builder.Services
    .AddAuthentication(options => {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options => {
    options.AddPolicy("TeaAppPolicy", policy => {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddHostedService<RefreshTokenCleanupService>();

if (builder.Environment.IsEnvironment("Testing")) {
    builder.Services.AddDataProtection().SetApplicationName("TeaApp.Tests");
}
else {
    var certificatePassword = builder.Configuration["DP_CERT_PASSWORD"]
        ?? throw new InvalidOperationException("DP_CERT_PASSWORD is not configured.");

    var certificate = X509CertificateLoader.LoadPkcs12FromFile(
        "/https/dp-keys.pfx",
        certificatePassword,
        X509KeyStorageFlags.EphemeralKeySet
    );

    builder.Services
        .AddDataProtection()
        .PersistKeysToFileSystem(new DirectoryInfo("/app/DataProtection-Keys"))
        .ProtectKeysWithCertificate(certificate)
        .SetApplicationName("TeaApp");
}

var app = builder.Build();

using (var scope = app.Services.CreateScope()) {
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    string[] roles = ["User", "Admin"];

    foreach (var role in roles) {
        if (!await roleManager.RoleExistsAsync(role)) {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();

    app.UseSwaggerUI(options => {
        options.SwaggerEndpoint("/openapi/v1.json", "TeaApp API v1");
    });
}

app.UseCors("TeaAppPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseHttpsRedirection();

app.Run();

public partial class Program { }
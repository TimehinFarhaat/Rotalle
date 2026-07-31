using CloudinaryDotNet;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Rotalle.Domain.Entities;
using Rotalle.Infrastructure.Identity;
using Rotalle.Infrastructure.Persistence;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

public partial class Program
{
    private static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);



        const string myCorsPolicy = "_myAllowSpecificOrigins";

        // 2. Add CORS services to the container
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: myCorsPolicy,
                policy =>
                {
                    policy.WithOrigins("http://localhost:5173",
                                       "https://rotalle.vercel.app") // Your frontend URL
                          .AllowAnyHeader()                     // Allows headers like Content-Type, Authorization, etc.
                          .AllowAnyMethod()                     // Allows POST, GET, PUT, DELETE, etc.
                          .AllowCredentials();                  // Needed if you handle cookies/auth tokens later
                });
        });
        builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(
                    new JsonStringEnumConverter(JsonNamingPolicy.CamelCase, allowIntegerValues: true));
       
            });


        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc(
                "v1",
                new OpenApiInfo
                {
                    Title = "Rotalle API",
                    Version = "v1",
                    Description = "Vehicle Rental Platform API"
                });

            options.AddSecurityDefinition(
                "Bearer",
                new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter your JWT token. Example: Bearer {token}"
                });

            // NEW syntax for Swashbuckle 10 / OpenApi 2.x
            options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference("Bearer", document)] = []
            });
        });

        builder.Services.AddPersistence(
            builder.Configuration);

        builder.Services
            .AddIdentityCore<ApplicationUser>(options =>
            {
                options.Password.RequiredLength = 8;

                options.Password.RequireDigit = true;

                options.Password.RequireUppercase = true;

                options.Password.RequireLowercase = true;

                options.Password.RequireNonAlphanumeric = true;

                options.User.RequireUniqueEmail = true;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddSignInManager();

        var jwtSettings = builder.Configuration
            .GetSection("Jwt");

        var jwtKey = jwtSettings["Key"]
            ?? throw new InvalidOperationException(
                "JWT Key is not configured.");

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
                    JwtBearerDefaults.AuthenticationScheme;

                options.DefaultChallengeScheme =
                    JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters =
                    new TokenValidationParameters
                    {
                        ValidateIssuer = true,

                        ValidateAudience = true,

                        ValidateLifetime = true,

                        ValidateIssuerSigningKey = true,

                        ValidIssuer =
                            jwtSettings["Issuer"],

                        ValidAudience =
                            jwtSettings["Audience"],

                        IssuerSigningKey =
                            new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(jwtKey))
                    };
            });

        builder.Services.AddAuthorization();

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            await IdentitySeeder.SeedRolesAsync(
                scope.ServiceProvider);
        }

        app.UseSwagger();

        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint(
                "/swagger/v1/swagger.json",
                "Rotalle API v1");

            options.RoutePrefix = "swagger";
        });

        app.UseHttpsRedirection();

        app.UseCors(myCorsPolicy);

        app.UseGlobalExceptionHandler();

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
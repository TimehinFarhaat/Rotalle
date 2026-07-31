using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Rotalle.Infrastructure.Identity;

public static class IdentitySeeder
{
    private static readonly string[] Roles =
    [
        "CUSTOMER",
        "PROVIDER",
        "ADMIN"
    ];

    public static async Task SeedRolesAsync(
        IServiceProvider services)
    {
        var roleManager =
            services.GetRequiredService<
                RoleManager<IdentityRole>>();

        foreach (var role in Roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(
                    new IdentityRole(role));
            }
        }
    }
}
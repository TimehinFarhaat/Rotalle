using Microsoft.AspNetCore.Identity;
using Rotalle.Application.DTOs.Auth;
using Rotalle.Application.Interfaces;
using Rotalle.Domain.Entities;
using Rotalle.Domain.Enums;

namespace Rotalle.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;

    private readonly ITokenService _tokenService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService)
    {
        _userManager = userManager;

        _tokenService = tokenService;
    }

    public async Task<AuthResponse> RegisterAsync(
        RegisterRequest request)
    {
        if (request.Role == UserRole.Admin)
        {
            throw new InvalidOperationException(
                "Admin accounts cannot be created through public registration.");
        }

        var existingUser =
            await _userManager.FindByEmailAsync(
                request.Email);

        if (existingUser is not null)
        {
            throw new InvalidOperationException(
                "A user with this email already exists.");
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,

            Email = request.Email,

            FullName = request.FullName,

            Role = request.Role,

            IsActive = true,

            EmailConfirmed = true
        };

        var result =
            await _userManager.CreateAsync(
                user,
                request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(
                "; ",
                result.Errors.Select(
                    error => error.Description));

            throw new InvalidOperationException(errors);
        }

        var roleName =
            request.Role
                .ToString()
                .ToUpperInvariant();

        await _userManager.AddToRoleAsync(
            user,
            roleName);

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(
        LoginRequest request)
    {
        var user =
            await _userManager.FindByEmailAsync(
                request.Email);

        if (user is null)
        {
            throw new UnauthorizedAccessException(
                "Invalid email or password.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException(
                "Your account has been suspended.");
        }

        var passwordValid =
            await _userManager.CheckPasswordAsync(
                user,
                request.Password);

        if (!passwordValid)
        {
            throw new UnauthorizedAccessException(
                "Invalid email or password.");
        }

        return CreateAuthResponse(user);
    }

    public async Task LogoutAsync(
     string userId)
    {
        var user =
            await _userManager.FindByIdAsync(
                userId);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "User not found.");
        }

       
    }

    public async Task<UserResponse> GetCurrentUserAsync(
        string userId)
    {
        var user =
            await _userManager.FindByIdAsync(
                userId);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "User not found.");
        }

        return MapUser(user);
    }

    private AuthResponse CreateAuthResponse(
        ApplicationUser user)
    {
        var token =
            _tokenService.CreateToken(
                user,
                out var expiresAt);

        return new AuthResponse
        {
            AccessToken = token,

            ExpiresAt = expiresAt,

            User = MapUser(user)
        };
    }

    private static UserResponse MapUser(
        ApplicationUser user)
    {
        return new UserResponse
        {
            Id = user.Id,

            FullName = user.FullName,

            Email = user.Email!,

            Role = user.Role,

            IsActive = user.IsActive
        };
    }
}
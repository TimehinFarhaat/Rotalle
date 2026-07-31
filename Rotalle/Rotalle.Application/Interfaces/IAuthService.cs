using Rotalle.Application.DTOs.Auth;

namespace Rotalle.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(
        RegisterRequest request);

    Task<AuthResponse> LoginAsync(
        LoginRequest request);

    Task<UserResponse> GetCurrentUserAsync(
        string userId);

    Task LogoutAsync(string userId);
}
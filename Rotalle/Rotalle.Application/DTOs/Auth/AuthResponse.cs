using Rotalle.Domain.Enums;
using System.Text.Json.Serialization;

namespace Rotalle.Application.DTOs.Auth;

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public UserResponse User { get; set; } = new();
}

public class UserResponse
{
    public string Id { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;


    public UserRole Role { get; set; }

    public bool IsActive { get; set; }
}
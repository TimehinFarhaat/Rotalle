using Rotalle.Domain.Entities;
using System;

namespace Rotalle.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(
        ApplicationUser user,
        out DateTime expiresAt);
}

using Microsoft.AspNetCore.Identity;

using Rotalle.Domain.Enums;
using System;
using System.Collections.Generic;

namespace Rotalle.Domain.Entities;

public class ApplicationUser : IdentityUser
{
	public string FullName { get; set; } = string.Empty;

	public UserRole Role { get; set; } = UserRole.Customer;

	public bool IsActive { get; set; } = true;

	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Vehicle> Vehicles { get; set; }
    = new List<Vehicle>();

    public ICollection<Booking> Bookings
    = new List<Booking>();
}
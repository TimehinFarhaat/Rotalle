using Rotalle.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Rotalle.Domain.Entities;

public class VehicleImage:AuditableEntity
{
   

    public Guid VehicleId { get; set; }

    
    public Vehicle Vehicle { get; set; } = null!;

    
    public string PublicId { get; set; } = string.Empty;

 
    public string Url { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public bool IsPrimary { get; set; }

    
}
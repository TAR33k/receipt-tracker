namespace ReceiptTracker.Core.Models;

public class MerchantAddress
{
    public string? HouseNumber { get; set; }
    public double HouseNumberConfidence { get; set; }
    public string? Road { get; set; }
    public double RoadConfidence { get; set; }
    public string? PostalCode { get; set; }
    public double PostalCodeConfidence { get; set; }
    public string? City { get; set; }
    public double CityConfidence { get; set; }
    public string? State { get; set; }
    public double StateConfidence { get; set; }
    public string? CountryRegion { get; set; }
    public double CountryRegionConfidence { get; set; }
    public string? StreetAddress { get; set; }
    public double StreetAddressConfidence { get; set; }
    public string? FullAddress { get; set; }
    public double FullAddressConfidence { get; set; }
}

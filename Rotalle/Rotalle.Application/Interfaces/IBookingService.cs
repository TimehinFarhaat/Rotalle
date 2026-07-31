public interface IBookingService
{
    Task<BookingResponse> CreateAsync(string customerId,CreateBookingRequest request);

    Task<List<BookingResponse>> GetCustomerBookingsAsync(string customerId);

    Task<BookingResponse?> GetCustomerBookingAsync( Guid bookingId, string customerId);

    Task CancelAsync(Guid bookingId,string customerId,string reason);

    Task<List<BookingResponse>> GetProviderBookingsAsync(string providerId);

    Task<BookingResponse?> GetProviderBookingAsync( Guid bookingId, string providerId);

    Task ApproveAsync( Guid bookingId,string providerId);

    Task RejectAsync( Guid bookingId,string providerId, string reason);

    Task PickupAsync(Guid bookingId, string providerId);

    Task ReturnAsync( Guid bookingId,string providerId);
}
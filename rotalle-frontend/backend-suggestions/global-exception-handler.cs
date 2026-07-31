// Program.cs — add this near the top of the middleware pipeline,
// before app.UseAuthorization(). Replaces the dev-exception-page
// behavior for all API responses with clean, typed JSON.

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var feature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        var ex = feature?.Error;

        var (status, message) = ex switch
        {
            KeyNotFoundException => (StatusCodes.Status404NotFound, ex.Message),
            UnauthorizedAccessException => (StatusCodes.Status403Forbidden, ex.Message),
            InvalidOperationException => (StatusCodes.Status400BadRequest, ex.Message),
            ArgumentException => (StatusCodes.Status400BadRequest, ex.Message),
            // Anything else is a genuine unexpected error — don't leak
            // internals, and log it server-side for yourself.
            _ => (StatusCodes.Status500InternalServerError, "Something went wrong. Please try again.")
        };

        if (status == StatusCodes.Status500InternalServerError)
        {
            // TODO: plug in your actual logger here (ILogger, Serilog, etc.)
            Console.Error.WriteLine(ex);
        }

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { message });
    });
});

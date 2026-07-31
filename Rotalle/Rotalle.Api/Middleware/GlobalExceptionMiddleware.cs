using System.Text.Json;



public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public GlobalExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = StatusCodes.Status500InternalServerError;

        switch (exception)
        {
            case KeyNotFoundException:
                statusCode = StatusCodes.Status404NotFound;
                break;

            case UnauthorizedAccessException:
                statusCode = StatusCodes.Status403Forbidden;
                break;

            case InvalidOperationException:
                statusCode = StatusCodes.Status400BadRequest;
                break;

            case ArgumentException:
                statusCode = StatusCodes.Status400BadRequest;
                break;
        }

        context.Response.StatusCode = statusCode;

        var response = new
        {
            message = exception.Message
        };

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(response));
    }
}
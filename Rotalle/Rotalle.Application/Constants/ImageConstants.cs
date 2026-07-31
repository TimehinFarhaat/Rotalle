namespace Rotalle.Application.Constants;

public static class ImageConstants
{
    public const int MaxImages = 5;

    public const int MaxImageSizeInMb = 5;

    public const long MaxImageSize =
        MaxImageSizeInMb * 1024 * 1024;

    public static readonly string[] AllowedContentTypes =
    {
        "image/jpeg",
        "image/png",
        "image/webp"
    };
}
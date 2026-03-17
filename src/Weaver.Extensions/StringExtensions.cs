using System.Security.Cryptography;
using System.Text;

namespace Weaver.Extensions;

public static class StringExtensions
{
    /// <summary>
    /// Calculates the SHA-256 hash of <see cref="value"/> and returns it as a <see cref="Sha256Hash"/>
    /// </summary>
    /// <param name="value">The value to get a hash for.</param>
    /// <returns>SHA-256 hash of the provided value.</returns>
    public static Sha256Hash ComputeSha256(this string value)
    {
        using var sha256 = SHA256.Create();
        byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(value));
        return Sha256Hash.FromBytes(bytes);
    }
    
    /// <summary>
    /// Tries to directly parse <see cref="value"/> and returns it as a <see cref="Sha256Hash"/>
    /// </summary>
    /// <param name="value">The value to parse to <see cref="Sha256Hash"/>.</param>
    /// <returns>The result as an SHA-256.</returns>
    public static Sha256Hash AsSha256(this string value)
    {
        return new Sha256Hash(value);
    }

    public static T ToEnum<T>(this string value) where T : Enum
    {
        return (T)Enum.Parse(typeof(T), value, true);
    }
}
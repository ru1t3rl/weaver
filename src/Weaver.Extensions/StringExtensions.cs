using System.Security.Cryptography;
using System.Text;

namespace Weaver.Extensions;

public static class StringExtensions
{
    public static Sha256Hash ToSha256Hash(this string value)
    {
        using var sha256 = SHA256.Create();
        byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(value));
        return Sha256Hash.FromBytes(bytes);
    }
}
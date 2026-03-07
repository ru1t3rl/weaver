
using System.Text.RegularExpressions;

namespace Weaver.Extensions;

/// <summary>
/// Represents a SHA-256 hash value as a value object.
/// </summary>
public readonly record struct Sha256Hash
{
    private static readonly Regex Sha256Regex = new("^[a-fA-F0-9]{64}$", RegexOptions.Compiled);

    public string Value { get; }

    public Sha256Hash(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("SHA-256 hash cannot be null or empty.", nameof(value));
        }

        var normalizedValue = value.Trim().ToLowerInvariant();

        if (!Sha256Regex.IsMatch(normalizedValue))
        {
            throw new ArgumentException(
                "Invalid SHA-256 hash format. Expected 64 hexadecimal characters.",
                nameof(value)
            );
        }

        Value = normalizedValue;
    }

    /// <summary>
    /// Creates a SHA-256 hash from a byte array.
    /// </summary>
    public static Sha256Hash FromBytes(byte[] bytes)
    {
        if (bytes == null || bytes.Length != 32)
        {
            throw new ArgumentException("SHA-256 hash must be exactly 32 bytes.", nameof(bytes));
        }

        string hexString = Convert.ToHexString(bytes).ToLowerInvariant();
        return new Sha256Hash(hexString);
    }

    /// <summary>
    /// Tries to parse a string as a SHA-256 hash.
    /// </summary>
    public static bool TryParse(string? value, out Sha256Hash hash)
    {
        hash = default;

        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        try
        {
            hash = new Sha256Hash(value);
            return true;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Converts the hash to a byte array.
    /// </summary>
    public byte[] ToBytes()
    {
        return Convert.FromHexString(Value);
    }

    public override string ToString() => Value;
    public static implicit operator string(Sha256Hash hash) => hash.Value;
}
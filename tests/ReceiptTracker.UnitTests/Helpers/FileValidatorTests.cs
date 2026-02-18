using FluentAssertions;
using ReceiptTracker.Core.Helpers;

namespace ReceiptTracker.UnitTests.Helpers;

public class FileValidatorTests
{
    [Theory]
    [InlineData("image/jpeg")]
    [InlineData("image/png")]
    [InlineData("application/pdf")]
    [InlineData("IMAGE/JPEG")]
    public void IsContentTypeAllowed_ValidTypes_ReturnsTrue(string contentType)
    {
        FileValidator.IsContentTypeAllowed(contentType).Should().BeTrue();
    }

    [Theory]
    [InlineData("application/exe")]
    [InlineData("text/plain")]
    [InlineData("image/gif")]
    [InlineData("")]
    [InlineData(null)]
    public void IsContentTypeAllowed_InvalidTypes_ReturnsFalse(string? contentType)
    {
        FileValidator.IsContentTypeAllowed(contentType).Should().BeFalse();
    }

    [Fact]
    public void HasValidMagicBytes_ValidJpeg_ReturnsTrue()
    {
        var jpegMagicBytes = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10 };
        using var stream = new MemoryStream(jpegMagicBytes);

        FileValidator.HasValidMagicBytes(stream, "image/jpeg").Should().BeTrue();
    }

    [Fact]
    public void HasValidMagicBytes_ValidPng_ReturnsTrue()
    {
        var pngMagicBytes = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A };
        using var stream = new MemoryStream(pngMagicBytes);

        FileValidator.HasValidMagicBytes(stream, "image/png").Should().BeTrue();
    }

    [Fact]
    public void HasValidMagicBytes_ValidPdf_ReturnsTrue()
    {
        var pdfMagicBytes = new byte[] { 0x25, 0x50, 0x44, 0x46, 0x2D, 0x31 };
        using var stream = new MemoryStream(pdfMagicBytes);

        FileValidator.HasValidMagicBytes(stream, "application/pdf").Should().BeTrue();
    }

    [Fact]
    public void HasValidMagicBytes_TextFileClaimedAsJpeg_ReturnsFalse()
    {
        var textContent = "This is not a JPEG"u8.ToArray();
        using var stream = new MemoryStream(textContent);

        FileValidator.HasValidMagicBytes(stream, "image/jpeg").Should().BeFalse();
    }

    [Fact]
    public void HasValidMagicBytes_DoesNotAlterStreamPosition()
    {
        var jpegBytes = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10 };
        using var stream = new MemoryStream(jpegBytes);
        stream.Position = 0;

        FileValidator.HasValidMagicBytes(stream, "image/jpeg");

        stream.Position.Should().Be(0, "stream position must be restored after validation");
    }

    [Fact]
    public void HasValidMagicBytes_FileSmallerThan4Bytes_ReturnsFalse()
    {
        using var stream = new MemoryStream(new byte[] { 0xFF, 0xD8 });

        FileValidator.HasValidMagicBytes(stream, "image/jpeg").Should().BeFalse();
    }

    [Fact]
    public void HasValidMagicBytes_NonSeekableStream_ThrowsArgumentException()
    {
        var nonSeekableStream = new NonSeekableStream();

        var act = () => FileValidator.HasValidMagicBytes(nonSeekableStream, "image/jpeg");

        act.Should().Throw<ArgumentException>().WithMessage("*seekable*");
    }

    [Theory]
    [InlineData("image/jpeg", ".jpg")]
    [InlineData("image/png", ".png")]
    [InlineData("application/pdf", ".pdf")]
    public void GetExtension_SupportedTypes_ReturnsCorrectExtension(string contentType, string expectedExtension)
    {
        FileValidator.GetExtension(contentType).Should().Be(expectedExtension);
    }

    [Fact]
    public void GetExtension_UnsupportedType_ThrowsArgumentException()
    {
        var act = () => FileValidator.GetExtension("application/exe");

        act.Should().Throw<ArgumentException>();
    }

    private class NonSeekableStream : Stream
    {
        public override bool CanRead => true;
        public override bool CanSeek => false;
        public override bool CanWrite => false;
        public override long Length => throw new NotSupportedException();
        public override long Position
        {
            get => throw new NotSupportedException();
            set => throw new NotSupportedException();
        }
        public override void Flush() { }
        public override int Read(byte[] buffer, int offset, int count) => 0;
        public override long Seek(long offset, SeekOrigin origin) => throw new NotSupportedException();
        public override void SetLength(long value) => throw new NotSupportedException();
        public override void Write(byte[] buffer, int offset, int count) => throw new NotSupportedException();
    }
}
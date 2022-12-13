resource "aws_s3_bucket" "app_bucket" {
  bucket        = "${var.lambda_function_name}-bucket"
  force_destroy = true

  tags = merge(var.default_tags, {
    Service = "App"
  })
}

resource "aws_s3_bucket_public_access_block" "public_access_block" {
  bucket = aws_s3_bucket.app_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "example" {
  bucket = aws_s3_bucket.app_bucket.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_policy" "public_access" {
  bucket = aws_s3_bucket.app_bucket.id
  policy = templatefile("./src/s3-policy.json", {
    "S3_ARN"         = "${aws_s3_bucket.app_bucket.arn}"
    "CLOUDFRONT_ARN" = "${aws_cloudfront_distribution.s3_distribution.arn}"
  })
}
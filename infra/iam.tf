resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_role_for_${var.lambda_function_name}_lambda"
  description        = "Trust relationships for ${var.lambda_function_name}"
  assume_role_policy = templatefile("./src/lambda-role.json", {})
  tags = merge(var.default_tags, {
    "Service" = "Server"
  })
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM logging policy for ${var.lambda_function_name}"
  policy = templatefile("./src/lambda-policy.json", {
    "LOG_GROUP"  = "${aws_cloudwatch_log_group.lambda_log_group.arn}:*",
    "SECRET_ARN" = "${aws_secretsmanager_secret.mongo_password.arn}"
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}


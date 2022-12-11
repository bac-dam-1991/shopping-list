resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "apigw_log_group" {
  name              = "/aws/lambda/${aws_apigatewayv2_api.lambda_api.name}"
  retention_in_days = 7
}

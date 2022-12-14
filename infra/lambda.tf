resource "aws_lambda_function" "server" {
  filename         = "${path.module}/dist/server.zip"
  function_name    = var.lambda_function_name
  role             = aws_iam_role.iam_for_lambda.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_function_src.output_base64sha256
  runtime          = "nodejs16.x"

  environment {
    variables = {
      AUTH0_JWKS_URI        = var.auth0_jwks_uri
      AUTH0_AUDIENCE        = var.auth0_audience
      AUTH0_ISSUER          = var.auth0_issuer
      MONGO_DB_NAME         = var.mongo_db_name
      MONGO_HOST            = var.mongo_host
      MONGO_USERNAME        = var.mongo_username
      SECRET_MONGO_PASSWORD = "${aws_secretsmanager_secret.mongo_password.name}"
      MONGO_SCHEME          = var.mongo_scheme
      MONGO_QUERY           = var.mongo_query
      DEFAULT_REGION        = var.default_region
    }
  }

  tags = merge(var.default_tags, {
    "Service" = "Server"
  })
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.server.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.lambda_api.execution_arn}/*/*"
}

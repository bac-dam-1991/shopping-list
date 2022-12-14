resource "aws_secretsmanager_secret" "mongo_password" {
  name                    = "${var.lambda_function_name}/mongo_password"
  description             = "MongoDB password for ${var.lambda_function_name}"
  recovery_window_in_days = 0

  tags = merge(var.default_tags, {
    "Service" : "Secrets"
  })
}

data "archive_file" "lambda_function_src" {
  type             = "zip"
  source_file      = "${path.module}/../back-end/dist/index.js"
  output_file_mode = "0666"
  output_path      = "${path.module}/dist/server.zip"
}

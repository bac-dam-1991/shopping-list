variable "lambda_function_name" {
  default = "shopping-list-app-server-tf"
}

variable "default_region" {
  default = "ap-southeast-2"
}

variable "s3_bucket_name" {
  default = "shopping-list-app-bucket"
}

variable "default_tags" {
  type = map(string)
  default = {
    "AppName" : "shopping-list-app-tf"
  }
}

variable "auth0_domain" {
  type    = string
  default = "shopping-list-app-prod.au.auth0.com"
}

variable "auth0_jwks_uri" {
  type    = string
  default = "https://shopping-list-app-prod.au.auth0.com/.well-known/jwks.json"
}

variable "auth0_audience" {
  type    = string
  default = "http://shopping-list-app.com"
}

variable "auth0_client_id" {
  type    = string
  default = "bGr19fELvQhAXTCV1JTqTbsCA7j3nYKU"
}

variable "auth0_issuer" {
  type    = string
  default = "https://shopping-list-app-prod.au.auth0.com/"
}

variable "mongo_db_name" {
  type    = string
  default = "shopping-list-app"
}

variable "mongo_host" {
  type    = string
  default = "bacdam.moeph.mongodb.net/"
}

variable "mongo_username" {
  type    = string
  default = "bacdam1991"
}

variable "mongo_scheme" {
  type    = string
  default = "mongodb+srv"
}

variable "mongo_query" {
  type    = string
  default = "retryWrites=true&w=majority"
}

variable "domain" {
  type    = string
  default = "shopping-list-app.bacdam.dev"
}

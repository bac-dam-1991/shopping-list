echo "Setting variables"
S3_BUCKET_NAME=shopping-list-app-tf-bucket

echo "Building application and server"
npm run build

echo "Cleanout ./dist"
rm -rf ./infra/dist

echo "Creating ./dist folder"
mkdir ./infra/dist

echo "Creating ./app folder"
mkdir ./infra/dist/app

echo "Copying application's files"
cp -r ./front-end/build/* ./infra/dist/app

echo "Deploying infrastructure"
cd ./infra
terraform apply -auto-approve -var="s3_bucket_name=$S3_BUCKET_NAME"

echo "Copying files to S3"
aws --profile=bacdam1991 s3 cp --recursive ./dist/app "s3://$S3_BUCKET_NAME/app"
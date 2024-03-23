# RescueGroups to Wix

Instead of using the default RescueGroups iFrame, which isn't mobile friendly,
this tool uses RescueGroups and WIX API to copy available pets from RescueGroups
to a Wix data collection. From there you can use dynamic pages to display the
pet data on your Wix website.

## Software Prerequisites

- NodeJS v18.15.0+
- Yarn 1.22+
- git 2.40+

## Account Prerequisites 

- RescueGroups Username/Password
- RescueGroups Account Number
- [WIX Token](https://dev.wix.com/docs/rest/articles/getting-started/api-keys)
- [WIX Collection](https://support.wix.com/en/article/cms-formerly-content-manager-creating-a-collection) (with the following columns)

  - animalId
  - breed
  - description
  - descriptionNoHtml
  - exactBirthdate
  - generalAge
  - location
  - locationPublic
  - name
  - needsAFoster
  - picture1
  - picture1Url
  - relativeAge
  - rescueId
  - sex
  - gallery   

## Install

```
git clone
cd RG-TO-WIX
yarn install
```

## Manual Usage

```
  yarn start -u {RG_USERNAME} -p {RG_PASSWORD} -a {RG-ACCOUNTID} -t {WIX_TOKEN} -c {WIX_COLLECTION}
```

## AWS Lambda Deployment

1. Install Code (see install instructions above)
1. Build Code (`yarn build`)
1. ZIP `dist` and `node_modules` folder
1. Upload ZIP to S3 Bucket
1. [Deploy CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stack.html) using `cloudformation.yaml`

## Manual Execution of Lambda

After the deployment of the cloudformation template, the stack outputs tab will
have a `LambdaFunctionURL`. This URL is a public url that will execute the RG to
Wix Lambda on every GET request.

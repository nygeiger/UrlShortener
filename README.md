# URL-Shortener

Try it here: https://url-shortener.nylesgeiger.com/

# Desing/implementation

## Deployment (AWS)

This app consits of a React front end, Node/Express backend, and MongoDB database.

To deploy on AWS the architecture will be:

<img width="1251" height="600" alt="image" src="https://github.com/user-attachments/assets/7eef7018-5343-4b4c-8ee8-552896694751" />

- Cloud front as CDN to serve the front end (S3) to a visitor's client
- Front end sends API calls to API Gateway which will direct them to "serverless" backend (Lambda)
- Backend which will be connected to MongoDB Atlas

##### Tid-bits
- Budgets
	- Notifications on spending milestones
- VPC

### Step 1: Backend

The backend will be deployed using Lambda. This provides an on-demand deployment of our backend, delivering it as a serverless function. This provides auto scaling, and at this scale reasonably helps manage costs.

Steps in AWS
- lambda function
	- Permissions/Role
		- AWSLambdaVPCAccessExecutionRole
	- Environment Variables
	- VPC, Subnets, & Security Groups
		- VPC - your services neighborhood
		- Subnets - locations (east-1b, east-1c, etc)
		- security groups - inbound/outbound rules ** Left off here seeing how to add Mongo Atlas to security group
	- severless-express
		- To convert express to a serverless structure which aws lambda supports
- NAT (for static IP)
	- fckNAT
		- Currently doesn't have any key requirement for logging in
		- Currently, No EIP
	- No-HA
		- HA = Autoscaling + fault tolerance
		- Shouldn't be needed. Will implement if necessary

### Step 2: Front End
- S3
	- Storage for the  optimized files of my front end.
	- In combination with Cloudfront, can be used to serve static websites
	- Add bucket policy to allow the cloudfront cdn to retrieve the files
- Cloudfront
	- The CDN provided aws.
	- Chaches wbsite data on edge locations to reduce retreival time for subsequent  requests
	- Pointed to s3 bucket to deliver it's files (the s3 is the "C" for this CDN)
-  Custom Domain
	- Cloudflare
		- DNS + Regisrtar used to purchase my custom domain
	- ACM
		- Essential for "SSL Handshake"
			- The browser now arrives at the AWS CloudFront server. Before it asks for files, it says: _"Prove you are actually `://yourdomain.com` so I know this is safe."_

### Step 3: CD
- Github Actions
	- For any future changes to be displayed when users navigate to the website, the front end changes must be deployed to the S3. Having a process where Code is automatically deployed is called "Continuous Development" (CD)
	- To Achieve this I created a Github Action to deploy my optimized front end files to the S3 whenever the main branch is updated

1. appPOST
sudo docker build -t post .

2. appGET
sudo docker build -t get .

3.
sudo docker run -d --hostname post \
        --name post \
        -p 8081:8081 \
	post

4.
sudo docker run -d --hostname get \
        --name get \
        -p 8082:8082 \
	get

5. repository name: hackathon-281-post

6. 
docker build -t cmpe281-hackathon-generateurl .

793159080441.dkr.ecr.us-west-1.amazonaws.com/hackathon-281-post 

sudo docker tag cmpe281-hackathon-generateurl:latest 793159080441.dkr.ecr.us-west-1.amazonaws.com/cmpe281-hackathon-generateurl:latest

sudo docker push 793159080441.dkr.ecr.us-west-1.amazonaws.com/cmpe281-hackathon-generateurl:latest

generate-url-api




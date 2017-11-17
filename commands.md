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

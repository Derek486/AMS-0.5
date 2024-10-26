sudo yum update -y
sudo yum install -y docker
sudo yum install -y libxcrypt-compat
sudo service docker start
sudo usermod -a -G docker ec2-user

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

sudo yum install git -y
git clone https://github.com/JuanJoseTCP/AMS-0.5.git
cd AMS-0.5
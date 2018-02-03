# Linux-Server-Configuration
In This project i will describe how to configure your linux-server and how to enable remote access to your server, how to enable firewall, how enable web-server service and finnaly how to change port number of some ports like ssh.

# Steps
1- First:you will need to install git from this site https://git-scm.com/downloads

2- Second: then you will open your virtual machine with your Udacity Account or you can use your pc.

3- Third: now we need to generate your key to authnticate from it when you want to make remote-access to your server 

4- open git-bash in specific folder you want to save keys in it, then write command ssh-keygen it will provide public and private key to use it when you make remote access to authenticate.

5- now will move on to your server 

a. First thing you need to make update your server

sudo apt-get update

sudo apt-get upgrade

b. First want to add account for you to use it when make remote access, will use command sudo adduser grader

c. we need to add permisions to grader will make some commands to give sudo access to grader

sudo nano /etc/sudoers.d/grader

then will write in file

grader ALL=(ALL) NOPASSWD:ALL

d. now we can switch to grader by this command

su - grader

e. now i want to add file to make authnticate from it, so i will take copy of public-address i has been created in our machine and add it in file called Authorized_keys

mkdir .ssh

nano .ssh/authorized_keys

f. now make some security to this folder and file

chmod 700 .ssh

chmod 644 .ssh/authorized_keys

e. now will restart ssh service 
sudo service ssh restart

6- now i can try to open remote access to my server 

ssh -i "private-key" grader@ip-address-of-server

7- now will start change port of service ssh 

sudo nano /etc/ssh/sshd_config 

now reload ssh service again

sudo service ssh restart

8- now i will enable firewall

sudo ufw allow 2200/tcp

sudo ufw allow 80/tcp

sudo ufw allow 123/udp

sudo ufw enable

now i can change port 22 to 2200 for example and test it again.

9- i can also change time zone of server 

sudo dpkg-reconfigure tzdata

10- finnaly i can configure Apache to my server

sudo apt-get install apache2

sudo service apache2 restart

11- also if you need database you can use postgresql

sudo apt-get install postgresql

13- finnaly you can try to open machine with it's public-ip

http://34.212.83.63/

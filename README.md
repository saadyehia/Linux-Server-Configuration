# Linux-Server-Configuration
In This project i will describe how to configure your linux-server and how to enable remote access to your server, how to enable firewall, how enable web-server service and finnaly how to change time-zone.

# Steps
1- First:you will need to install git from this site https://git-scm.com/downloads

2- Second: then you will open your virtual machine with your Udacity Account or you can use your pc.

3- Third: now we need to generate your key to authnticate from it when you want to make remote-access to your server 

4- open git-bash in specific folder you want to save keys in it, then write command ssh-keygen it will provide public and private key to use it when you make remote access to authenticate.

5- now will move on to your server 

a. First thing you need to make update your server

sudo apt-get update

sudo apt-get upgrade

b. First want to add account for you to use it when make remote access, will use command 

sudo adduser grader

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

g- no i will change port-number it's using for "SSH" connection, will change it from 22 to 2200

sudo nano /etc/ssh/sshd_config

e. now will restart ssh service 

sudo service ssh restart

6- now i can try to open remote access to my server 

ssh -i "private-key" grader@52.88.111.55

7- finnaly i can configure Apache to my server

sudo apt-get install apache2

sudo service apache2 restart

8- now i will enable firewall

sudo ufw allow 2200/tcp

sudo ufw allow 80/tcp

sudo ufw allow 123/udp

sudo ufw enable

9- i can also change time zone of server 

sudo dpkg-reconfigure tzdata

10- also if you need database you can use postgresql

sudo apt-get install postgresql

11- finnaly you can try to open machine with it's public-ip

http://52.88.111.55/

12- start Add Flask application to our server

Step-One Install the apache webserver and mod_wsgi

$ sudo apt-get update

$ sudo apt-get install apache2

$ sudo apt-get install libapache2-mod-wsgi

Step-Two Install Flask using the pip tool (which also needs to be installed)

$ sudo apt-get install python-pip

$ sudo pip install flask

Step-Three Create a directory for our Flask app

We'll create a directory in our home directory to work in, and link to it from the site-root defined in apache's configuration /var/www/html 

$ mkdir ~/flaskapp

$ sudo ln -sT ~/flaskapp /var/www/html/flaskapp

Step-Four Running a Flask app

Put the following content in a file named flaskapp.py, i use "render_template" to open my projcet "html-file"

from flask import Flask
from flask import render_template
app = Flask(__name__)

@app.route('/')
def index():
        return render_template('index.html')
if __name__ == '__main__':
  app.run()

Step-Five create folder static for JS and CSS files and templates for html files, then put your files inside them

$mkdir static templates

Step-Six  Create a .wsgi file to load the app, Put the following content in a file named flaskapp.wsgi

import sys
sys.path.insert(0, '/var/www/html/flaskapp')

from flaskapp import app as application

Step-Seven Enable mod_wsgi => add the following block just after the DocumentRoot /var/www/html line

$sudo nano/etc/apache2/sites-enabled/000-default.conf

WSGIDaemonProcess flaskapp threads=5
WSGIScriptAlias / /var/www/html/flaskapp/flaskapp.wsgi

<Directory flaskapp>
    WSGIProcessGroup flaskapp
    WSGIApplicationGroup %{GLOBAL}
    Order deny,allow
    Allow from all
</Directory>

Step-Eight Restart the webserver

sudo apachectl restart

Step-Nine Test configuration => http://52.88.111.55/


References https://www.datasciencebytes.com/bytes/2015/02/24/running-a-flask-app-on-aws-ec2/

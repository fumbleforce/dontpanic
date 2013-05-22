============
Don't Panic!
============

A serious board game developed in HTML5 and JavaScript/node.js

============
Installation
============

NOTE!
You need to be connected to the NTNU network either by being on campus or connected through VPN, as the database is located at IDI.

1.   

Start by extracting the local "node-v0.10.2.tar.gz" to a folder of your choice, then follow the instructions below.


2.

Prerequisites (Unix only):
    * Python 2.6 or 2.7
    * GNU Make 3.81 or newer
    * libexecinfo (FreeBSD and OpenBSD only)


3.

Unix/Macintosh:

Run the following commands in the terminal:

    ./configure
    make
    make install

If your python binary is in a non-standard location or has a
non-standard name, run the following instead:

    export PYTHON=/path/to/python
    $PYTHON ./configure
    make
    make install


Windows:

Run the following file:

    vcbuild.bat

 

4.

After installation, start a local server using the command "node server" in the command line/terminal after navigating to the folder which you extracted to.


5.

Open Chrome, and navigate to the following address:

    http://127.0.0.1:8008/


6.

Play the game! A guide is provided in the report.

#essential package

    node version v0.10~
    mongodb version 3.0~

#optional package
    ImageMagick 6.9~


#essential file


    1.create folder
    /config
    2.create new file /config/config.js

    module.exports = {
        dbName:"blog",  //Name of the database
        dbPort:27017,   //Port of the database
        dbHost:"localhost"  //server host
    }


    3.create new file /config/www.js

    module.exports = {
        wwwPort:8000  //server port
    }


    4.start app
        cd /project
        node ./bin/www
        
    5.access
        http://127.0.0.1:port/debate
    6.username:miyoshi
      password:miyoshi
      username:syoui
      password:syoui
  
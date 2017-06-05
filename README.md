# process-engine-cli

Command line tool for certain process engine.
The tool use [public api](https://doc.corezoid.com/en/api/ "Corezoid Api")  of the process engine.
At the current moment the main point of this tool is automatic export of deployed processes and versioning of its.

### Install

    npm install process-engine-cli -g

### Requirements

Git should be installed on your local environment to get full functionality.

### Usage

    crz init

The above command generate two configuration files:
  * .env
  * crzconfig.json

".env" file will contain sensitive data. It will contain "Login" and "Secret key" for project access via api.
For more details see documentation about [api keys](https://doc.corezoid.com/en/interface/users_groups.html#api-keys "api-keys")

    COREZOID_API_LOGIN=<Login>
    COREZOID_API_KEY=<Secret key>

This parameters can be substitured by the same system environment variables

"crzconfig.json" file will contain general configuration and detailed parameters for certain tasks.

    {
        "api_url": "https://admin.corezoid.com/",
        "auth_with_api_key": true,
        "watch": {
            "refresh_interval": 90,
            "object_id": 10,
            "object_type": "folder",
            "workdir": "./workdir/"
        }
    }

  * api_url - obviously url to api
  * auth_with_api_key - to perform authentication with usage api key. Should be true for almost all cases.
  * watch - parameters for command *watch*
    + refresh_interval - it is interval defined in seconds. The tool will periodically reget data from the engine with this interval
    + object_id - id of object. This object will be exported and procesed.
    + object_type - type of object which will be monitored. It can be "conv" or "folder" or "dashboard". The best way is folder
    + workdir - local folder. It will be used to store exported object. Local git repository will be built in this folder

You should appropriately configure parameters and after that you can start monitor your project with the following command

    crz watch

It can be convenient, because you not needed perform this operation manually and by default export file contain data which not quite fit for version control.

# node-react with travis and heroku
Example template for node-react app that can be built in Travis CI and deployed to Heroku. In local development app is running in docker containers.  

## Prequisites
* [docker](https://docs.docker.com/)
* [docker-compose](https://docs.docker.com/compose/)
* [nodejs](https://nodejs.org/) and [npm](https://www.npmjs.com/) if you want to run eslint or install dependencies locally
* [travis CLI](https://github.com/travis-ci/travis.rb)
* [heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and [heroku account](https://signup.heroku.com/login)

## Set up development environment
- Copy template to your local machine. You can, for example, download or clone and set new remote.

### Run
- Ensure that docker is running, and then in project root dir run:  
```docker-compose up```  

It reads `docker-compose.yml` and builds, creates, starts, and attaches services to containers (frontend, backend, db). Backend, frontend and db (postgres in this case) have Dockerfiles in root directories. Images are build automatically by reading the instructions from a Dockerfile.

To run containers in detached mode (in the background), use `docker-compose up -d`  
If you want to start only some of the containers, you can specify containers, for example `docker-compose up backend db`
- `docker ps -a` to check which containers are running and in which ports
- backend is served in `localhost:9000` (example api in `localhost:9000/api/greetings`)
- frontend is served in `localhost:8000`
- db is served in `localhost:5432`

### Stop containers
```docker-compose down```

### Remove images
```docker system prune -a```

### Remove volumes
* list volumes `docker volume ls`
* remove specific volume `docker volume rm [VOLUME NAME]`

### Building images
If you need to build images, you can use (or with --no-cache flag)  

```docker-compose build```

### Access to a docker container
To access eg. backend container, run  
```docker-compose exec backend sh```  
This links the container's bash to your local shell. From there you can i.e. run tests or use add dependencies.

### Running tests
Backend tests can be run simply by `npm run test`, either in the backend container or in your local machine if you have installed all the dependencies.

## ESLint
Both backend and frontend have configuration for [ESLint](https://eslint.org/). ESLint has integrations for several editors (https://eslint.org/docs/user-guide/integrations), and it's recommended to use such extension, as it makes it easy to detect possible errors. To get it work in your editor, you have to install eslint packages to you local machine (`npm install`, see packages from package.jsons). 

Both backend and frontend use [airbnb-config](https://github.com/airbnb/javascript) (defined in .eslintrc file). It's also possible to use some other configuration, or add rules directly to `.eslintrc`.

### Run lint in command line
It's highly recommended to use ESLint in editor, but if you want to run lint in command line, run (in backend or frontend, in a docker container or locally):
```npm run lint```

## Building in Travis
When project exists in github, you can activate it in Travis CI   
* https://travis-ci.org/ => sign in with github
* Add new repository by activating repository from repository list
* Create a git branch from where you want travis to build automatically (in this example it is `master`). If you're using some other named branch than master, change branch name in .travis.yml:  
    ```  
    branches:  
        only:  
         - [your_branch_name]  
    ```
* Push your changes to "build branch", and travis will start the build process. 
### Build process
* Travis builds project according to `.travis.yml`. There is specified which language should be used, what other services does it need (docker) and which branch it builds.
* `script`-step defines what should be done in travis. In this example project, it  
    * runs ESLint for backend, 
    * builds project with docker-compose 
    * runs backend tests with docker-compose
    * prepares frontend bundle for heroku deployment. [Webpack](https://webpack.js.org/) is used for this. 
* `deploy`-step defines where the app should be deployed.        
If any of these steps results in an error, build fails and app will not be deployed.


## Preparation for Heroku deployment
In order to get travis to deploy the app to heroku, do the following steps
* Go to project root dir and create heroku app  
```heroku login```  
```heroku create```  
* Add generated app name to .travis.yml deploy section
* Go to [heroku dashboard](https://dashboard.heroku.com/) and add heroku postgres add-on to your heroku app (go to your app -> "resources")  
    * This will add DATABASE_URL variable to heroku ("settings" -> "reveal config vars") 
* Generate encrypted token between travis and heroku and add it to .travis.yml  
```travis encrypt $(heroku auth:token) --add deploy.api_key```  

In heroku app runs in one (backend) instance, or dyno, as it's called in heroku. Frontend is used as static (using koa-static in backend). Database is heroku postgres add-on. When navigating to `your-app-123.herokuapp.com` it routes to frontend index. Backend requests are routed to `/api`.

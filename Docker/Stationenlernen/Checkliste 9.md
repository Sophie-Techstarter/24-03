https://www.lightenna.com/tech/2021/docker-exercises/

### Docker Exercises Checkliste

#### **Exercise: Containerising a Node.js Webserver**
- [ ] Create a simple Node.js web server  
- [ ] Create `index.js` to expose a web server on port 3030  
- [ ] Test locally using `npm install` and `npm start`  
- [ ] Run `curl localhost:3030` to verify the server is running  
- [ ] Write a Dockerfile to:
  - [ ] Use a Node.js base image  
  - [ ] Copy `package.json` and run `npm install` at build time  
  - [ ] Expose port 3030  
- [ ] Instantiate the image and connect to the container  
- [ ] Verify the web service is accessible inside and outside the container  
- [ ] Use Docker as a non-root user (e.g., user 1000)  
- [ ] Set appropriate file permissions  

#### **Exercise: Augment Existing Dockerfile**
- [ ] Use `FROM` to reference the latest NGINX base image  
- [ ] Install an additional package (e.g., `procps`)  
- [ ] Copy a local `nginx.conf` file into the container  
- [ ] Copy a local website (e.g., `index.html`) into the container  
- [ ] Run NGINX as a non-root user (e.g., user 1000)  
- [ ] Configure NGINX to use `/tmp` for writable outputs  

#### **Exercise: Environment Variables**
- [ ] Pass a `PORT` environment variable into the Docker container  
- [ ] Modify the Node.js code to use `PORT` or default to `8080`  
- [ ] Test without setting `PORT`, verify it's accessible on port 8080  
- [ ] Set `PORT` in the Dockerfile and verify the change  
- [ ] Set `PORT` via `docker run` command and retest  

#### **Exercise: Volumes**
- [ ] Mount `nginx.conf` as a volume instead of copying it  
- [ ] Modify the `nginx.conf` and restart the container to apply changes  
- [ ] Mount the local website directory as a volume  
- [ ] Modify the local website and restart the container  

#### **Exercise: Docker-Compose**
- [ ] Create a `docker-compose.yml` file for an ELK stack:
  - [ ] Elasticsearch: `docker.elastic.co/elasticsearch/elasticsearch:7.10.0`  
  - [ ] Logstash: `docker.elastic.co/logstash/logstash:7.10.0`  
  - [ ] Kibana: `docker.elastic.co/kibana/kibana:7.10.0`  
- [ ] Run the stack using `docker-compose up`  
- [ ] Pass environment variables to Elasticsearch (e.g., `discovery.type=single-node`)  
- [ ] Expose ports 9200 for Elasticsearch and 5601 for Kibana  
- [ ] Ensure Elasticsearch starts before Logstash and Kibana using `depends_on`  
- [ ] Test internal and external access to Elasticsearch and Kibana

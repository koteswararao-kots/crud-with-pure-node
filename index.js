
//source: https://medium.com/@gabrielferrari_/this-tutorial-will-dive-in-the-node-js-b4c1d6f94fab
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const { type } = require('os');
const data = fs.readFileSync('./data.json');
let projects = JSON.parse(data);

let lastindex = projects.length === 0 ? 0 : projects[projects.length-1].id;

const server = http.createServer((req, res) => {
  
    const urlparse = url.parse(req.url, true);
    
    if(urlparse.pathname == '/projects' && req.method == 'GET')
    {
      //TODO: GET logic
      res.writeHead(200, {'Content-Type': 'applicaion/json'});
      res.end(JSON.stringify(projects));
    }

    if(urlparse.pathname == '/projects' && req.method == 'POST')
    {
      //TODO: POST logic
      req.on('data', data => {
        const jsonData = JSON.parse(data);
        console.log("jsonData", jsonData);
        const title = jsonData.title; 
        if (title) {
            projects.push({id: ++lastindex, title: title, tasks: []});
            console.log("projects", projects);
            fs.writeFile('./data.json', JSON.stringify(projects), (err) => {
                if (err) {
                    const message = {message: "NO DATA IS SAVED"}
                    res.write(500,  {'Content-Type': 'applicaion/json'})
                    res.end(JSON.stringify(message))
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(projects, null, 2));
                }
            })
        } else {
            const message = {message: "NO TITLE FOUND"}
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(message));
        }
      })
    }

    if(urlparse.pathname == '/projects/tasks' && req.method == 'POST')
    {
      //TODO: POST logic
      req.on('data', data => {
          const search = urlparse.search;
          if (search) {
            const [,query] = search.split("?");
            const id = querystring.parse(query).id
            if (id) {
                const jsonData = JSON.parse(data);
                projects.forEach((project, idx)  => {
                    if (project.id == id) {
                        projects[idx].tasks.push(jsonData.task)
                    }
                })
                fs.writeFile('./data.json', JSON.stringify(projects), err => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end({message: "NO DATA SAVED"});
                    } else {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(projects));

                    }
                })
            } else {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: "NO ID FOUND"}));

            }
          }
      })



    }
    if(urlparse.pathname == '/projects' && req.method == 'PUT')
    {
      //TODO: PUT logic

      req.on('data', data => {
          const search = urlparse.search;
          if (search) {
              const [,query] = search.split("?");
              const id = querystring.parse(query).id
              if (id) {
                  const jsonData = JSON.parse(data);
                  const title = jsonData.title
                  if (title) {
                      
                      projects.forEach((project, idx)  => {
                          if (project.id == id) {
                              projects[idx].title = title;
                            }
                        })
                    fs.writeFile('./data.json', JSON.stringify(projects), err => {
                        if (err) {
                            res.writeHead(500, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({message: "NO DATA SAVED"}));
                        } else {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(projects));
                            
                        }
                    })
                } else {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: "NO TITLE FOUND"}));
                    
                }
            } else {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: "NO ID FOUND"}));
                
            }
        }
      })
    }
    
    if(urlparse.pathname == '/projects' && req.method == 'DELETE') {
        const search = urlparse.search;
        if (search) {
            const [, query] = urlparse.search.split('?');
            const data = querystring.parse(query);

            projects = projects.filter(project => project.id != data.id);

            fs.writeFile('./data.json', JSON.stringify(projects), (err) => {
                if (err) {
                    const message = { message: 'could not persist data!' };
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(message, null, 2));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(projects, null, 2));
                }
            });
        } else {
            const message = { message: 'no query parameter!' };
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(message, null, 2));
        }
    }
  });

  server.listen(4000);
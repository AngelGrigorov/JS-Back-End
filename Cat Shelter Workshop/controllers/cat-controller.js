const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const rootPath = path.normalize(path.join(__dirname, '../views/cat/'));
const catService = require('../services/cat-service');
const cats = require('../data/cats.json');
const globalPath =  path.normalize(path.join(__dirname, '../'));

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === '/add-cat' && req.method === 'GET') {        
        const stream = fs.createReadStream(rootPath + 'addCat.html');

        stream.on('data', (data) => {
            res.write(catService.readBreeds(data));
        });

        stream.on('end', () => {
            res.end();
        });

        stream.on('error', (err) => {
            console.log(err);
        });
    } else if (pathname === '/add-cat' && req.method === 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                throw err;
            }

            console.log(files.upload.path);
            console.log(globalPath);
            console.log(process.env.TMPDIR);
            
            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join(globalPath, '/public/images/' + files.upload.name));
           
            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    throw err;
                }
                console.log('File uploaded successfully');
            });

            fs.readFile('../Cat Shelter/data/cats.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }

                let allCats = JSON.parse(data);
                allCats.push({ id: cats.length + 1, ...fields, image: files.upload.name });
                let json = JSON.stringify(allCats);

                fs.writeFile('../Cat Shelter/data/cats.json', json, () => {
                    res.writeHead(302, { Location: '/' });
                    res.end();
                });
            });
        });


    } else if (pathname === '/add-breed' && req.method === 'GET') {
        const stream = fs.createReadStream(rootPath + 'addBreed.html');

        stream.on('data', (data) => {
            res.write(data);
        });

        stream.on('end', () => {
            res.end();
        });

        stream.on('error', (err) => {
            console.log(err);
        });
    } else if (pathname === '/add-breed' && req.method === 'POST') {
        let formData = '';

        req.on('data', (data) => {
            formData += data;
        });

        req.on('end', () => {
            let body = qs.parse(formData);

            catService.writeBreed(body);            

            res.writeHead(302, { Location: '/' });
            res.end();            
        });   
    } else if (pathname.includes('/edit-cat') && req.method === 'GET') {
        const filePath = path.normalize(
            path.join(__dirname, '../views/cat/editCat.html')
        );

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(`Error: ${err}`);

                if (err.code == 'ENOENT') {
                    res.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });

                    res.write('The requested resource was not found.');
                    res.end();
                } else {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    res.write(`An error has occured. (${err.code})`);
                    res.end();
                }
                return;
            }

            res.writeHead(200, {
                'Content-Type': `text/html`
            });

            fs.readFile('./data/cats.json', (err, catsData) => {
                if (pathname[pathname.length - 1] !== '/') {
                    let splitUrl = pathname.split('/');
                    let catId = Number(splitUrl[splitUrl.length - 1]);


                    fetchBreeds().then((breeds) => {
                        let catsDB = JSON.parse(catsData);
                        let catObject = catsDB.find(catElem => {
                            return catElem.id === catId;
                        });

                        data = data.toString().replace('{{id}}', catId);
                        data = data.replace('{{catName}}', catObject.name);
                        data = data.replace('{{catDescription}}', catObject.description);
                        data = data.replace('{{catBreed}}', catObject.breed);

                        let breedsPlaceholder = breeds.map((breed) => breed === catObject.breed ?
                            `<option selected value="${breed}">${breed}</option>` :
                            `<option value="${breed}">${breed}</option>`);
                        let finalData = data.replace('{{catBreeds}}', breedsPlaceholder);

                        res.write(finalData);
                        res.end();
                    });
                }
            });
        });
    } else if (pathname.includes('/delete-cat') && req.method === 'GET') {
        const filePath = path.normalize(
            path.join(__dirname, '../views/cat/catShelter.html')
        );

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(`Error: ${err}`);

                if (err.code == 'ENOENT') {
                    res.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });

                    res.write('The requested resource was not found.');
                    res.end();
                } else {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    res.write(`An error has occured. (${err.code})`);
                    res.end();
                }
                return;
            }

            res.writeHead(200, {
                'Content-Type': `text/html`
            });

            fs.readFile('./data/cats.json', (err, catsData) => {
                if (pathname[pathname.length - 1] !== '/') {
                    let splitUrl = pathname.split('/');
                    let catId = splitUrl[splitUrl.length - 1];

                    let catsDB = JSON.parse(catsData);
                    let catObject = catsDB.find(catElem => {
                        return catElem.id == catId;
                    });

                    if (catObject) {
                        data = data.toString().replaceAll('{{id}}', catId);
                        data = data.replaceAll('{{catImage}}', catObject.image);
                        data = data.replaceAll('{{catName}}', catObject.name);
                        data = data.replaceAll('{{catDescription}}', catObject.description);
                        data = data.replaceAll('{{catBreed}}', catObject.breed);
                    }
                }

                res.write(data);
                res.end();
            });
        });
    } else if (pathname.includes('/edit-cat') && req.method === 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.write(`An error has occured. (${err.code})`);
                res.end();

                throw err;
            }

            fs.readFile('./data/cats.json', (err, data) => {
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    res.write(`An error has occured. (${err.code})`);
                    res.end();

                    throw err;
                }

                if (pathname[pathname.length - 1] !== '/') {
                    let splitUrl = pathname.split('/');
                    let catId = Number(splitUrl[splitUrl.length - 1]);

                    let catsDB = JSON.parse(data);

                    let oldCat = catsDB.find(obj => obj.id === catId);
                    let oldCatIndex = catsDB.indexOf(oldCat)
                    let newCat = { id: catId, ...fields, image: `${files.upload.size === 0 ? oldCat.image : files.upload.name}` };

                    catsDB[oldCatIndex] = newCat;
                    let parsedCatsDB = JSON.stringify(catsDB);

                    (async () => {
                        if (files.upload.size !== 0) {
                            let oldFilePath = files.upload.path;
                            let newFilePath = path.normalize(
                                path.join(__dirname, `../public/images/${files.upload.name}`)
                            );

                            await moveFile(oldFilePath, newFilePath);
                        }

                        fs.writeFile('./data/cats.json', parsedCatsDB, () => {
                            res.writeHead(302, {
                                'Location': '/'
                            });
                            res.end();
                        });
                    })();
                }
            });
        });
    } else if (pathname.includes('/delete-cat') && req.method === 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.write(`An error has occured. (${err.code})`);
                res.end();

                throw err;
            }

            fs.readFile('./data/cats.json', (err, data) => {
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    res.write(`An error has occured. (${err.code})`);
                    res.end();

                    throw err;
                }

                if (pathname[pathname.length - 1] !== '/') {
                    let splitUrl = pathname.split('/');
                    let catId = Number(splitUrl[splitUrl.length - 1]);

                    let catsDB = JSON.parse(data);

                    catsDB = catsDB.filter(obj => obj.id !== catId);

                    let parsedCatsDB = JSON.stringify(catsDB);

                    fs.writeFile('./data/cats.json', parsedCatsDB, () => {
                       
                        res.writeHead(302, {
                            'Location': '/'
                        });
                        res.end();
                    });
                }
            });
        });
    } else {
        return true;
    }
}

function fetchBreeds() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/breeds.json', (err, data) => {
            if (err) {
                reject(err);
            } else {
                let breedsDB = JSON.parse(data);
                resolve(breedsDB);
            }
        });
    });
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
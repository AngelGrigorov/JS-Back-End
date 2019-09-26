const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable')
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');
const globalPath = path.normalize(path.join(__dirname, '../'));
module.exports = (req, res) => {
const pathname = url.parse(req.url).pathname;
if(pathname === '/cats/add-cat' && req.method === 'GET'){
   
    let filePath = path.normalize(
        path.join(__dirname, '../views/addCat.html'));
        const index = fs.createReadStream(filePath);
        index.on('data', (data) =>{
            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);
            res.write(modifiedData);
        });
        index.on('end', () =>{
            res.end();
        });
        index.on('error', (err) => {
            console.log(err);
        });
}else if(pathname === '/cats/add-breed' && req.method === 'GET'){
    let filePath = path.normalize(
        path.join(__dirname, '../views/addBreed.html'));
        const index = fs.createReadStream(filePath);
        index.on('data', (data) =>{
            res.write(data);
        });
        index.on('end', () =>{
            res.end();
        });
        index.on('error', (err) => {
            console.log(err);
        });
}else if(pathname === '/cats/add-breed' && req.method === 'POST'){
    let formData = '';
  
    req.on('data', (data) =>{
      formData += data;
    
    });
    req.on('end', () =>{
        let body = qs.parse(formData);
        
        fs.readFile('./data/breeds.json', (err, data) => {
            if(err){
                throw err;
            }
        
            let breeds = JSON.parse(data);
            breeds.push(body.breed);
            let json = JSON.stringify(breeds);
            fs.writeFile('./data/breeds.json', json, 'utf-8', () => console.log('The breed was created successfully!'));
        });
      
        res.writeHead(302, { location: '/' });
        res.end();

    });
}else if(pathname === '/cats/add-cat' && req.method === 'POST'){
    let form = new formidable.IncomingForm();
    form.parse(req, (err,fields, files) =>{
        if(err){
            throw err;
        }
        let oldPath = files.upload.path;
        let newPath = path.normalize(path.join(globalPath,'/content/images/' + files.upload.name));
    fs.rename(oldPath,newPath, (err) => {
        if(err){
            console.log("Files arent uloaded!");
            throw err;
            }
        });
    fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
        if(err){
            throw err;
        }
        let allCats = JSON.parse(data);
        allCats.push({ id: cats.length + 1, ...fields, image: files.upload.name });
            let json = JSON.stringify(allCats);
            fs.writeFile('./data/cats.json', json, () =>{
            res.writeHead(302, {location: '/' });
            res.end();
            });
        });
    });
  

}else{
    return true;
}
};

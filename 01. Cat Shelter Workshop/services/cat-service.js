const fs = require('fs');
const breeds = require('../data/breeds');
const cats = require('../data/cats');

 module.exports = {
    readBreeds: (data) => {
        let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
        let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);

        return modifiedData;
    },

    writeBreed: (body) => {
        fs.readFile('../Cat Shelter/data/breeds.json', (err, data) => {
            if (err) {
                throw err;
            }

            let breeds = JSON.parse(data);
            breeds.push(body.breed);
            let json = JSON.stringify(breeds);

            fs.writeFile('../Cat Shelter/data/breeds.json', json, 'utf-8', () => console.log('The breed was updated successfully'));
        });
    }
}
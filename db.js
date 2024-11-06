import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";

export const createDB = (filePath) => {
    return {
        file: filePath,
        prepareFile: function() {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '{}');
            }
        },
        readFile: function () {
            this.prepareFile();
            return JSON.parse(fs.readFileSync(this.file, 'utf8'))
        },
        saveFile: function (data) {
            this.prepareFile();
            fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
        },
        find: function (id) {
            let data = this.readFile();
            return data[id];
        },
        findAll: function() {
            let data = this.readFile();
            return Object.values(data);
        },
        findBy: function (criteria, limit = null) {
            let data = this.readFile();
            let result = [];

            itemLoop: for (const id in data) {
                const item = data[id];

                for (const [key, value] of Object.entries(criteria)) {
                    if (item[key] !== value) {
                        continue itemLoop;
                    }
                }

                result.push(item);
            }

            return result;
        },
        findOneBy: function (criteria) {
            let data = this.readFile();

            itemLoop: for (const id in data) {
                const item = data[id];

                for (const [key, value] of Object.entries(criteria)) {
                    if (item[key] !== value) {
                        continue itemLoop;
                    }
                }

                return item;
            }
        },
        save: function (item) {
            let data = this.readFile();
            if(!item.id){
                do {
                    item.id = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
                } while(this.find(item.id));
            }
            data[item.id] = item;
            this.saveFile(data);
        },
        delete: function (id) {
            let data = this.readFile();
            delete data[id];
            this.saveFile(data);
        }
    }
}



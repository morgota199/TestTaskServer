import * as express from "express";
import * as bodyParser from "body-parser";
import * as fs from'fs';
import * as multer from "multer";
import Autos from "./autos";

const app = express(),
      port:number = 3000,
      secretKey:string = "qwerty";

let element:number = 0,
    stop:boolean = false,
    base,
    fileData;

app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb', parameterLimit: 100000000}));
app.use(multer({dest:"uploads"}).any());

app.get("/", (req, res) => { res.sendStatus(404) });
app.get("/autos", (req, res) => { res.sendStatus(404) });
app.get('/filter', (req, res) => {
    if(secretKey === req.body.key) {
        stop = true;
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});


app.post("/filter", async (req: any, res: any) => {
    if(secretKey === req.body.key) {
        let nowDate = new Date().getTime(),
            milOldData = nowDate - 2592000000,
            oldData = new Date(milOldData).getTime();

            do {
                let autoNull = await Autos.find({check: null}).limit(50000),
                    autoMonth = await Autos.find({check: {$lte: oldData}}).limit(50000);

                base = {...autoNull, ...autoMonth};

                if (Object.keys(base).length !== 0) {
                    await (async function GetSearch() {
                        if (stop === false) {
                            let data = base[element];
                            let dock = await Autos.find({
                                OKPOCode: data.OKPOCode,
                                carrierName: data.carrierName,
                                licStatus: data.licStatus,
                                licIssueDate: data.licIssueDate,
                                licStartDate: data.licStartDate,
                                licEndDate: data.licEndDate,
                                vhclNum: data.vhclNum,
                                vhclType: data.vhclType,
                                vhclStatus: data.vhclStatus,
                                vhclVendorID: data.vhclVendorID,
                                vhclModel: data.vhclModel,
                                vhclWt: data.vhclWt,
                                loadCap: data.loadCap,
                                vchlManufYear: data.vchlManufYear,
                                vchlNumSeats: data.vchlNumSeats,
                                vchlVIN: data.vchlVIN,
                                certTypeID: data.certTypeID,
                                vhclSerie: data.vhclSerie,
                                docNum: data.docNum,
                                certSeries: data.certSeries,
                                certNum: data.certNum,
                                certDateFrom: data.certDateFrom,
                                taxType: data.taxType
                            });

                            if (dock.length > 1) {
                                for (let del = 0; del < dock.length; del++) {
                                    if (del > 0) {
                                        await Autos.find(dock[del]).remove(() => {
                                            console.log("Удалено");
                                        });
                                    }
                                }
                            }

                            element += 1;
                            dock[0].check = new Date();
                            dock[0].save();

                            setTimeout(GetSearch, 1);
                        } else {
                            element = 0;
                            stop = false;
                            await res.sendStatus(200);
                        }
                    })();
                }
                element = 0;
            } while (Object.keys(base).length !== 0);
        await res.sendStatus(200);
    } else {
        await res.sendStatus(401);
    }
});

app.post("/delete", (req: any, res: any) => {
    if(secretKey === req.body.key){
        let search = req.body.search;
        Autos.deleteMany({vhclNum: search}, () => {
            res.sendStatus(200);
        })
    } else {
        res.sendStatus(401);
    }
});

app.post("/search", (req: any, res: any) => {
    if(secretKey === req.body.key){
        let search = req.body.search;
        Autos.find({vhclNum: search}, (err, dock) => {
            res.send(JSON.stringify(dock));
        });
    } else {
        res.sendStatus(401);
    }
});

app.post("/autos", async (req: any, res: any) => {
    if(req.body.key === secretKey){
        for(let i = 0; i < req.files.length; i++){
            fileData = req.files[i];
            if(fileData) {
                let jsonData = await JSON.parse(fs.readFileSync(`./${fileData.path}`, 'utf-8')),
                    iter:number = 0;

                await(async function WrireToBase(){
                    if(iter < jsonData.length){
                        let auto = new Autos({...jsonData[iter], check: null});
                        await auto.save();
                        iter += 1;
                        setTimeout(WrireToBase, 2);
                    } else {
                        await fs.unlinkSync(`./${fileData.path}`);
                        await res.sendStatus(200);
                    }
                })();
            } else {
                await res.sendStatus(404);
            }
        }
    } else {
        await res.sendStatus(401);
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${ port }`);
});
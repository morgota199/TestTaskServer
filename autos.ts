import * as mongoose from "mongoose";

const uri: string = "mongodb://127.0.0.1:27017/test_database";

mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Successfully Connected!");
    }
});

export interface IAutos extends mongoose.Document {
    OKPOCode:           String,
    carrierName:        String,
    licStatus:          String,
    licIssueDate:       String,
    licStartDate:       String,
    licEndDate:         String,
    vhclNum:            String,
    vhclType:           String,
    vhclStatus:         String,
    vhclVendorID:       String,
    vhclModel:          String,
    vhclWt:             String,
    loadCap:            String,
    vchlManufYear:      String,
    vchlNumSeats:       String,
    vchlVIN:            String,
    certTypeID:         String,
    vhclSerie:          String,
    docNum:             String,
    certSeries:         String,
    certDateFrom:       String,
    certNum:            String,
    taxMar:             String,
    taxType:            String,
    taxSerieses:        String,
    check:              Date
}

export const AutosSchema = new mongoose.Schema({
    OKPOCode:           { type: String, required: false },
    carrierName:        { type: String, required: false },
    licStatus:          { type: String, required: false },
    licIssueDate:       { type: String, required: false },
    licStartDate:       { type: String, required: false },
    licEndDate:         { type: String, required: false },
    vhclNum:            { type: String, required: false },
    vhclType:           { type: String, required: false },
    vhclStatus:         { type: String, required: false },
    vhclVendorID:       { type: String, required: false },
    vhclModel:          { type: String, required: false },
    vhclWt:             { type: String, required: false },
    loadCap:            { type: String, required: false },
    vchlManufYear:      { type: String, required: false },
    vchlNumSeats:       { type: String, required: false },
    vchlVIN:            { type: String, required: false },
    certTypeID:         { type: String, required: false },
    vhclSerie:          { type: String, required: false },
    docNum:             { type: String, required: false },
    certSeries:         { type: String, required: false },
    certDateFrom:       { type: String, required: false },
    certNum:            { type: String, required: false },
    taxMar:             { type: String, required: false },
    taxType:            { type: String, required: false },
    taxSerieses:        { type: String, required: false },
    check:              { type: Date, required: false }
});

const Autos = mongoose.model<IAutos>("Autos", AutosSchema);
export default Autos;
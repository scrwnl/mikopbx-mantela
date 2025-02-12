import { Database } from "jsr:@db/sqlite@0.12.0";
import {Mantela, AboutMe, Extension, Provider} from "./types.ts"

const db = new Database("mikopbx.db");

//const aboutMe: AboutMe = {}

const extensions:Extension[] = db.prepare("SELECT extension,description FROM m_Sip").values()
.map(([name, extension]:string[]) => (
    {name: name, extension: extension, type: "unknown", model: ""}
));

const providers: Provider[] = []

// JSONにするオブジェクトをつくる
const mantela: Mantela = {
    version: "0.0.0",
    aboutMe: {
        name: "Example PBX",
        prefferedPrefix: "0123",
        identifier: "7e33cf20-e8d4-11ef-a9d8-00224858950d",
    },
    extensions: extensions,
    providers: providers
}


// Mantelaを出力
console.log(JSON.stringify(mantela, null, "    "));
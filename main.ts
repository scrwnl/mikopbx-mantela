import { parseArgs } from "@std/cli";
import { Database } from "@db/sqlite";
import {Mantela, AboutMe, Extension, Provider} from "./types.ts"

let dbPath: string = "mikopbx.db"
if (Deno.args.length <= 1) {  // mikopbx-mantela /var/spool/mikopbx/cf/conf/mikopbx.db
    dbPath = Deno.args[0] == undefined ? dbPath : Deno.args[0];
} else {
    console.error("エラー: 引数の個数が間違っています。");
}

const db = new Database(dbPath, {create: false, readonly: true});

const pbxName:string = db.prepare("SELECT value FROM m_PbxSettings WHERE key = 'Name'").value<[string]>()![0];
const aboutMe: AboutMe = {name: pbxName, prefferedPrefix: "", identifier: ""}

const extensions:Extension[] = db.prepare("SELECT extension,description FROM m_Sip WHERE type = 'peer'").values()
.map(([name, extension]:string[]) => (
    {name: name, extension: extension, type: "phone", model: ""}
));

const providers: Provider[] = db.prepare("SELECT rulename, numberbeginswith FROM m_OutgoingRoutingTable").values()
.map(([name, prefix]:string[])=>(
    {name: name, prefix: prefix, identifier: "", mantela: ""}
))

// JSONにするオブジェクトをつくる
const mantela: Mantela = {
    $schema: "https://kusaremkn.github.io/mantela/mantela.schema.json",
    version: "0.0.0",
    aboutMe: aboutMe,
    extensions: extensions,
    providers: providers
}


// Mantelaを出力
console.log(JSON.stringify(mantela, null, "    "));
import { parseArgs } from "@std/cli";
import { Database } from "@db/sqlite";
import {Mantela, AboutMe, Extension, Provider} from "./types.ts"
import { dedent } from "ts-dedent"
import { version } from "./version.ts";


const args = parseArgs(Deno.args, {
    boolean: ["h", "help", "v", "version", "include-self", "force"],
    string: ["o", "output"]
})

if (args["help"] || args["h"]) {
    console.log(dedent`
        Usage: mikopbx-mantela [オプション...] <mikopbx.dbのファイルパス>
            -o, --output <file>\t出力するJSONファイル名を指定します。省略した場合、mantela.jsonが使用されます。
                --include-self\t指定した場合、providersに自局が追加されます。
            -h, --help\tこのヘルプが表示されます。
            -v, --version\tバージョン情報が出力されます。
        `)
    Deno.exit(0)
} else if (args["version"] || args["v"]) {
    console.log(dedent`
        mikopbx-mantela バージョン: ${version}
        対応するMantela仕様: 0.0.0
        `)
    Deno.exit(0);
}

// 出力ファイル名を決定
const outputFilePath = (() => {if (args["o"]) {
    return args["o"]
} else if (args["output"]) {
    return args["output"]
} else {
    return "mantela.json"
}})()

// mikopbx.dbのパスを取得
if (args["_"].length != 1) {
    console.error("エラー: 引数のフォーマットが正しくありません。")
    Deno.exit(1)
}
const dbPath:string = args["_"][0].toString()

// dbを開く
const db = (() => {
    try {
        return new Database(dbPath, {create: false, readonly: true});
    } catch (_error) {
        console.error("エラー: 指定されたデータベースを開けませんでした。");
        Deno.exit(1);
    }
})();

const pbxName:string = (() => {
    try {
        return db.prepare("SELECT value FROM m_PbxSettings WHERE key = 'Name'").value<[string]>()![0];
    } catch (_error) {
        console.error("エラー: 情報の取得に失敗しました。誤ったファイルを指定している可能性があります。")
        Deno.exit(1);
    }
})();
const aboutMe: AboutMe = {name: pbxName, prefferedPrefix: "", identifier: ""}

const extensions:Extension[] = (()=>{
    try {
        return db.prepare("SELECT extension,description FROM m_Sip WHERE type = 'peer'").values()
        .map(([name, extension]:string[]) => (
            {name: name, extension: extension, type: "phone", model: ""}
        ));
    } catch (_error) {
        console.error("エラー: 情報の取得に失敗しました。誤ったファイルを指定している可能性があります。")
        Deno.exit(1);
    }
})()

const providers: Provider[] = (()=>{
    try {
        return db.prepare("SELECT rulename, numberbeginswith FROM m_OutgoingRoutingTable").values()
.map(([name, prefix]:string[])=>(
    {name: name, prefix: prefix, identifier: "", mantela: ""}
))
    } catch (_error) {
        console.error("エラー: 情報の取得に失敗しました。誤ったファイルを指定している可能性があります。")
        Deno.exit(1);
    }
})()

// 自分自身をprovidersに含むかどうかの判定
if (args["include-self"]) {
    providers.unshift({name: aboutMe.name, prefix: aboutMe.prefferedPrefix, identifier: aboutMe.identifier, mantela: ""})
}

// JSONにするオブジェクトをつくる
const mantela: Mantela = {
    $schema: "https://tkytel.github.io/mantela/mantela.schema.json",
    version: "0.0.0",
    aboutMe: aboutMe,
    extensions: extensions,
    providers: providers
}


// Mantelaを出力
try {
    Deno.writeTextFile(outputFilePath, JSON.stringify(mantela, null, "    "))
} catch (_error) {
    console.error(`エラー: ${outputFilePath}への書き込みに失敗しました。`)
    Deno.exit(1)
}

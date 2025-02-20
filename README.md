# mikopbx-mantela
[MikoPBX](https://www.mikopbx.com/)の設定データベースから[mantela.json](https://github.com/KusaReMKN/mantela/blob/main/MANTELA.md)のテンプレートを生成する

## ビルド方法
```bash
$ deno task build
$ ./build/mikopbx-mantela [path to mikopbx.db]
```
## 使い方
```
Usage: mikopbx-mantela [オプション...] <mikopbx.dbのファイルパス>
    -o, --output <file> 出力するJSONファイル名を指定します。省略した場合、mantela.jsonが使用されます。
        --include-self  指定した場合、providersに自局が追加されます。
    -h, --help          このヘルプが表示されます。
    -v, --version       バージョン情報が出力されます。
```
## 注意
このリポジトリは、MikoPBX及びMIKO LLCとは一切関係がありません。

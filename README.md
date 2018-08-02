<img src="https://github.com/lmangani/kibana-kable/raw/master/public/header.png" />

# kable 6.2.4
Does stuff with like, fields, and expressions, and stuff. Also things.
Not the [Real Kable](https://github.com/rashidkpc/kable)

### Functions

| name  | description | param  |
|---|---|---|
| latest  | Get the latest value of some field  | `field`,`by`  |
| add  | Add one column, or number, by another  | `col1`,`col2`,`dest`  |
| bottom  | Find the least common values for a field  | `field`,`count`#  |
| display | Specify the index to search  | `display`,`columns`[]  |
| divide  | Divide one column, or number, by another  | `dividend`,`divisor`,`dest`  |
| docs  | Make with the querying  | `count`#  |
| exregex  | Inline Regex functions  | `src`,`replace`,`with`,`dest`  |
| exsplit  | Split a field at a delimiter  | `src`,`separator`,`index`#,`dest`  |
| finalize | Finalizes a chain. Optional. |   |
| index | Specify the index to search  | `index`,`timefield`  |
| multiply  | Multiply one column, or number, by another  | `col1`,`col2`,`dest`   |
| search  | Filter Search  | `search`  |
| stats  | Calculate Statistic Aggs  | `stats`[],`field`  |
| substract  | Subtract one column, or number, by another  | `col1`,`col2`,`dest`   |
| table  | Select columns in a table, and optionally rename them  | `columns`[],`as`[]  |
| timeseries  | Create timeseries   | `field`,`interval`,`format`  |
| top  | Select top results  | `field`,`count`#  |


## Pro tips

You need to turn on regexs in Painless if you want any of the field extraction stuff

```
./bin/elasticsearch -Escript.painless.regex.enabled=true
```

Also, you need to extract from the `.keyword` version of fields if you're using the defauld elasticsearch mapping as `.exsplit()` and `.exregex()` use `doc[]` and you can't access `doc[]` for analyzed fields.

## Credits

This is a Fork of the [Real Kable](https://github.com/rashidkpc/kable)

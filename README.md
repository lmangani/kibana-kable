<img src="https://github.com/lmangani/kibana-kable/raw/master/public/header.png" />

# Kable 6.2
Does stuff with like, fields, and expressions, and stuff. Also things.
Not the [Real Kable](https://github.com/rashidkpc/kable) 

![ezgif com-optimize 7](https://user-images.githubusercontent.com/1423657/43681015-555f84a6-9848-11e8-81f3-94c20167d629.gif)

## Installation
```
kibana-plugin install https://github.com/lmangani/kibana-kable/raw/master/dist/kable-6.2.4.zip
```
#### Custom Release
```
./release.sh
```

### Functions

| name  | description | param  |
|---|---|---|
| add  | Add one column, or number, by another  | `col1`,`col2`,`dest`  |
| bottom  | Find the least common values for a field  | `field`,`count`#  |
| display | Specify the index to search  | `display`,`columns`[]  |
| divide  | Divide one column, or number, by another  | `dividend`,`divisor`,`dest`  |
| docs  | Make with the querying  | `count`#  |
| exregex  | Inline Regex functions  | `src`,`replace`,`with`,`dest`  |
| exsplit  | Split a field at a delimiter  | `src`,`separator`,`index`#,`dest`  |
| finalize | Finalizes a chain. Optional. |   |
| index | Specify the index to search  | `index`,`timefield`  |
| latest  | Get the latest value of some field  | `field`,`by`  |
| multiply  | Multiply one column, or number, by another  | `col1`,`col2`,`dest`   |
| search  | Filter Search  | `search`  |
| stats  | Calculate Statistic Aggs  | `stats`[],`field`  |
| substract  | Subtract one column, or number, by another  | `col1`,`col2`,`dest`   |
| table  | Select columns in a table, and optionally rename them  | `columns`[],`as`[]  |
| timeseries  | Create timeseries   | `field`,`interval`,`format`  |
| top  | Select top results  | `field`,`count`#  |


#### Pro tips

You need to turn on regexs in Painless if you want any of the field extraction stuff

```
./bin/elasticsearch -Escript.painless.regex.enabled=true
```

Also, you need to extract from the `.keyword` version of fields for Search

---------

### Acknowledgements
This is an extended Fork of the [Real Kable](https://github.com/rashidkpc/kable) by [Rashid Khan](https://github.com/rashidkpc)

Elasticsearch and Kibana are trademarks of Elasticsearch BV, registered in the U.S. and in other countries.

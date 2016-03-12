# Mooncraft

Somewhere in the seventh millenia, long after Humans have become extinct, only plants can withstand Solar Radiation.
A new breed of curious sentient beings has emerged after centuries of mutations from radiation exposure.
They call themselves "Ents", live in "The Garden" and follow the teachings of their oldest member, the "Tree of Knowledge".

#### Installation

* `npm install`
* [Redis](http://redis.io/topics/quickstart)

#### NPM Commands

* `npm run dev`
* `npm run dist`

# Requests And Responses

### Query : Player
###### Request
```
{
  "type": "player"
}
```
###### Response
```
{
}
```

### Query : Map
###### Request
```
{
  "type": "map",
  "id"  : "RegionID"
}
```
###### Response
```
{
}
```

### Enter
###### Request
```
{
  "id": "RegionID"
}
```
###### Response
```
{
}
```

### Leave
###### Request
```
{
  "id": "RegionID"
}
```
###### Response
```
{
}
```

### Move
###### Request
```
{
  "id": "RegionID",
  "x" : 1,
  "y" : 2
}
```
###### Response
```
{
}
```

### Investigate
###### Request
```
{
  "id": "RegionID",
  "x" : 1,
  "y" : 2
}
```
###### Response
```
{
}
```

### Say
###### Request
```
{
  "id": "RegionID",
  "message" : "Hello World!"
}
```
###### Response
```
{
}
```

### Harvest
###### Request
```
{
  "id": "RegionID",
  "x" : 1,
  "y" : 2
}
```
###### Response
```
{
}
```

### Build
###### Request
```
{
  "id"  : "RegionID",
  "x"   : 1,
  "y"   : 2,
  "type": "NodeID" 
}
```
###### Response
```
{
}
```
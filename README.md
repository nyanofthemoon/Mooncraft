# Mooncraft

Somewhere in the seventh millenia, long after Humans have become extinct, only a select few plants appear to have survived Solar Radiation.

A new breed of seemingly sentient beings has emerged due to centuries of mutations from radiation exposure.
They call themselves "Ents", live in "The Garden" and follow the teachings of their oldest member, the "Tree of Knowledge".

Status: On hiatus for rehaul using [redux](https://github.com/reactjs/redux).

[>>> Play MoonCraft <<<](https://mooncraft.protolicio.us/)

# Installation

### Development

* `npm install`
* `redis-server --port 6379`
* `npm run dev` runs the development environment using webpack-dev-server + hot reload

### Deployment

* Both a `npm run start` script and `Procfile` are included for Heroku or custom deployment.
* `npm run dist` builds the production distribution package for JS, CSS and other assets

# Requests And Responses

### Query Player

###### Request
```js
socket.emit('query', data)
```
```json
data = {
  "type": "player"
}
```
###### Response
```js
socket.on('query', callback)
```
```json
{
  "type": "player",
  "data": {
  	"name": "Nyan",
    "icon": "default",
    "region": {
        "id": "CG",
    	"x": 1,
        "y": 1
    },
    "inventory": {}
  }
}
```

### Query Region
###### Request
```js
socket.emit('query', data)
```
```json
data = {
  "type": "region",
  "id"  : "CG"
}
```
###### Response
```js
socket.on('query', callback)
```
```json
{
    "type": "region",
    "data": {
    	"id": "CG",
        "name": "The Garden",
        "description": "The World's Last Safe Haven.",
        "tiles": [],
        "nodes": [],
        "items": []
    }
}
```

### Query Cycling
###### Request
```js
socket.emit('cycling', data)
```
```json
data = {}
```
###### Response
```js
socket.on('query', callback)
```
```json
{
    "type": "cycling",
    "data": {
    	"cycle": "evening"
    }
}
```

### Enter
###### Request
```js
socket.emit('enter', data)
```
```json
data = {
  "id": "CG"
}
```
###### Response
```js
socket.on('query', data)
```

### Leave
###### Request
```js
socket.emit('leave', data)
```
```json
data: {
  "id": "CG"
}
```
###### Response
```js
socket.on('query', data)
```

### Move
###### Request
`socket.emit('move', data)`
```json
{
  "id": "CG",
  "x" : 1,
  "y" : 2
}
```
###### Response
```js
socket.on('query', data)
```

### Investigate
###### Request
```js
socket.emit('investigate', data)
```
```json
data = {
  "id": "RegionID",
  "x" : 1,
  "y" : 2
}
```
###### Response
```js
socket.on('query', data)
```

### Say
###### Request
```js
socket.emit('say', data)
```
```json
data = {
  "id": "CG",
  "message" : "Hello World!"
}
```
###### Response
```js
socket.on('say', data)
```

### Harvest
###### Request
```js
socket.emit('harvest', data)
```
```json
data = {
  "id": "CG",
  "x" : 1,
  "y" : 2
}
```
###### Response
```js
socket.on('query', data)
```

### Build
###### Request
```js
socket.emit('build', data)
```
```json
data = {
  "id"  : "CG",
  "x"   : 1,
  "y"   : 2,
  "type": 100
}
```
###### Response
```js
socket.on('query', data)
```

# Credits

Credits and relevant licenses for game art and music included in the `credits` directory. Thank you! :3
* http://opengameart.org/content/lpc-tile-atlas
* http://opengameart.org/content/lpc-tile-atlas2
* http://opengameart.org/content/lpc-dungeon-elements
* http://freemusicarchive.org/music/BoxCat_Games
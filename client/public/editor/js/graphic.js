var TILES = {"0":{"name":"Void","icon":"void.gif","description":"The edge of the world.","walkable":false},"1":{"name":"Grass","icon":"grass_1.gif","description":"A patch of grass.","walkable":true},"2":{"name":"Sand","icon":"sand_1.gif","description":"A patch of sand.","walkable":true},"3":{"name":"Water","icon":"shallow-water.gif","description":"A patch of shallow water.","walkable":false}};
var NODES = {"1":{"name":"Purified Space","icon":"space.gif","description":"An empty space.","walkable":true,"harvestable":false,"buildable":true,"ownable":false,"transportable":false},"2":{"name":"Teleport","icon":"teleport.gif","description":"A teleport to another region.","walkable":true,"harvestable":false,"buildable":false,"ownable":false,"transportable":{"region":null,"x":null,"y":null}},"100":{"name":"Radiated Space","icon":"radiated-space.gif","description":"Barren space. It needs to be purified.","walkable":true,"buildable":false,"ownable":false,"harvestable":{"quantity":3,"transform":1}},"101":{"name":"Radiated Space","icon":"radiated-space-bone.gif","description":"Barren space containing remains. It needs to be purified.","walkable":true,"buildable":false,"ownable":false,"harvestable":{"item":1,"quantity":1,"transform":100}},"102":{"name":"Radiated Space","icon":"radiated-space-bone-pile.gif","description":"Barren space containing many remains. It needs to be purified.","walkable":false,"buildable":false,"ownable":false,"harvestable":{"item":1,"quantity":1,"transform":101}},"200":{"name":"Tree","icon":"tree.gif","description":"A tall tree.","walkable":false,"harvestable":{"item":2,"quantity":2,"transform":201},"buildable":false,"ownable":false,"transportable":false},"201":{"name":"Tree Stump","icon":"tree-stump.gif","description":"What remains of a once proud tree.","walkable":false,"harvestable":{"item":2,"quantity":1,"transform":1},"buildable":false,"ownable":false,"transportable":false},"300":{"name":"Wood Fence","icon":"wood-fence.gif","description":"A wooden fence built by someone.","walkable":false,"harvestable":false,"buildable":false,"ownable":{"owner":null,"date":null},"transportable":false}};
var ITEMS = {"1":{"name":{"singular":"Dust","plural":"Dust"},"description":{"singular":"Worth absolutely nothing.","plural":"A pile worth absolutely nothing."},"walkable":{"singular":true,"plural":false},"icon":{"singular":"dust.gif","plural":"pile-of-dust.gif"},"price":0,"quantity":1,"weight":1,"pickable":true,"droppable":true,"consummable":false,"containable":false,"invisible":false},"2":{"name":{"singular":"Log","plural":"Logs"},"description":{"singular":"A simple wood log.","plural":"A pile of simple wood logs."},"walkable":{"singular":true,"plural":false},"icon":{"singular":"log.gif","plural":"pile-of-logs.gif"},"price":1,"quantity":1,"weight":10,"pickable":true,"droppable":true,"consummable":false,"containable":false,"invisible":false}};
function Game(n, types) {

  var _game = this

  function Tile(type) {
    var _tile = this

    this.type = type
    this.selected = ko.observable(false)

    this.tileClass = ko.computed(function() {
      return 'tileType' + type + (_tile.selected() ? ' selected' : '')
    })
  }

  this.columns = _.range(n).map(function() {
    return ko.observableArray()
  })

  this.fillGrid = function fillGrid() {
    this.columns.forEach(function(col) {
      col(_.range(n).map(function() {
        return new Tile(_.random(1, types))
      }))
    })
  }

  this.select = function select(tile) {
    if(_game.source) {
      _game.swapTiles(_game.source, tile)
      _game.source.selected(false)
      _game.source = null
    }
    else {
      _game.source = tile
      tile.selected(true)
    }
  }

  this.swapTiles = function swapTiles(tile1, tile2) {
    function findTileCoords(tile) {
      var i, j
      for(i = 0; i < n; i++) {
        j = _game.columns[i].indexOf(tile)
        if(j !== -1) break
      }
    return [i, j]
    }
    var tile1Coords = findTileCoords(tile1)
      , tile2Coords = findTileCoords(tile2)
    _game.columns[tile1Coords[0]].splice(tile1Coords[1], 1, tile2)
    _game.columns[tile2Coords[0]].splice(tile2Coords[1], 1, tile1)
  }

  this.fillGrid()

}

var game = new Game(10, 5)

$(function() {
  ko.applyBindings(game)
})

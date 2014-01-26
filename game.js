function Game(n, types) {

  var _game = this

  function Column() {
    var _column = this

    this.tiles = ko.observableArray()
    this.offsetClass = ko.computed(function() {
      return 'offset' + (n - _column.tiles().length)
    })

    this.tilesReversed = ko.computed(function() {
      return Array.prototype.slice.call(_column.tiles()).reverse()
    })
  }

  function TileGrid(n) {
    var _grid = this

    this.columns = _.range(n).map(function(){return new Column})

    this.getTile = function(i, j) {
      if(i < 0 || i >= n) return void(0)
      return _grid.columns[i].tiles()[j]
    }

    this.horizontalRunCount = function(i, j, type) {
      var x
        , count = 1
        , tile

      if(!type) type = getTile(i, j).type

      for(x = i + 1; x < n; x++) {
        tile = _grid.getTile(x, j)
        if(!tile) break
        else if(tile.type !== type) break
        count++
      }
      for(x = i - 1; x > 0; x--) {
        tile = _grid.getTile(x, j)
        if(!tile) break
        else if(tile.type !== type) break
        count++
      }
      return count
    }

    this.verticalRunCount = function(i, j, type) {
      var y
        , count = 1
        , tile

      if(!type) type = getTile(i, j).type

      for(y = j + 1; y < n; y++) {
        tile = _grid.getTile(i, y)
        if(!tile) break
        else if(tile.type !== type) break
        count++
      }
      for(y = j - 1; y > 0; y--) {
        tile = _grid.getTile(i, y)
        if(!tile) break
        else if(tile.type !== type) break
        count++
      }
      return count
    }

    this.addTile = function(x) {
      var avoidTypes = []
        , typesAvailable
        , column = _grid.columns[x]
        , testTypes
        , y

      y = column.tiles().length

      testTypes = _.filter( [ _grid.getTile(x-1, y)
                            , _grid.getTile(x, y-1)
                            , _grid.getTile(x+1, y)
                            ]
                          ).map(function(tile) { return tile.type })

      testTypes.forEach(function(type) {
        if(_grid.verticalRunCount(x, y, type) >= 2) avoidTypes.push(type)
        if(_grid.horizontalRunCount(x, y, type) >= 2) avoidTypes.push(type)
      })

      typesAvailable = _.difference(_.range(1, types+1), avoidTypes)
      column.tiles.push(new Tile(_.sample(typesAvailable)))
    }

    ko.computed(function() {
      _grid.columns.forEach(function(column, i) {
        if(column.tiles().length < n) {
          _grid.addTile(i)
        }
      })
    }).extend({throttle: 250})

    // this gets the computed started, dunno why it's needed...
    window.setTimeout(function() {
      _.range(n).forEach(function(i) {
        _grid.addTile(i)
      })
    }, 250)
  }

  function Tile(type) {
    var _tile = this

    this.type = type
    this.selected = ko.observable(false)

    this.tileClass = ko.computed(function() {
      return 'tileType' + type + (_tile.selected() ? ' selected' : '')
    })
  }

  this.select = function(tile) {
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

  this.swapTiles = function(tile1, tile2) {
    function findTileCoords(tile) {
      var i, j
      for(i = 0; i < n; i++) {
        j = _game.grid.columns[i].tiles.indexOf(tile)
        if(j !== -1) break
      }
    return [i, j]
    }
    var tile1Coords = findTileCoords(tile1)
      , tile2Coords = findTileCoords(tile2)
    _game.grid.columns[tile1Coords[0]].tiles.splice(tile1Coords[1], 1, tile2)
    _game.grid.columns[tile2Coords[0]].tiles.splice(tile2Coords[1], 1, tile1)
  }

  this.grid = new TileGrid(n)

}

var game = new Game(10, 7)

$(function() {
  ko.applyBindings(game)
})


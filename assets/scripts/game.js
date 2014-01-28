function Game(n, types) {

  var _game = this

  function Tile(x, y, type) {
    var _tile = this

    this.x = x
    this.y = y
    this.type = type
    this.selected = ko.observable(false)
    this.highlighted = ko.observable(false)

    this.tileClass = ko.computed(function() {
      return 'tileType'
           + type
           + (_tile.selected() ? ' selected' : '')
           + (_tile.highlighted() ? ' highlighted' : '')
    })
  }

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
    this.selectedTile = null

    this.getTile = function(x, y) {
      if(x < 0 || x >= n) return void(0)
      return _grid.columns[x].tiles()[y]
    }

    this.horizontalRunCount = function(i, j, type, tile1, tile2) {
      var x
        , count = 1
        , tile
        , getTile = function(x, y) {
          if(tile1 && tile2) {
            if(x === tile1.x && y === tile1.y) return tile2
            if(x === tile2.x && y === tile2.y) return tile1
          }
          return _grid.getTile(x, y)
        }

      if(!type && (tile = getTile(i, j))) type = tile.type
      else if(!type) return 0

      for(x = i + 1; x < n; x++) {
        tile = getTile(x, j)
        if(!tile) break
        else if(tile.type !== type) break
        count++
      }
      for(x = i - 1; x >= 0; x--) {
        tile = getTile(x, j)
        if(!tile) break
        else if(tile.type !== type) break
        count++
      }
      return count
    }

    this.verticalRunCount = function(i, j, type, tile1, tile2) {
      var y
        , count = 1
        , tile
        , getTile = function(x, y) {
          if(tile1 && tile2) {
            if(x === tile1.x && y === tile1.y) return tile2
            if(x === tile2.x && y === tile2.y) return tile1
          }
          return _grid.getTile(x, y)
        }

      if(!type && (tile = getTile(i, j))) type = tile.type
      else if(!type) return 0

      for(y = j + 1; y < n; y++) {
        tile = getTile(i, y)
        if(!tile) break
        else if(tile.type !== type) break
        count++
      }
      for(y = j - 1; y >= 0; y--) {
        tile = getTile(i, y)
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
      column.tiles.push(new Tile(x, y, _.sample(typesAvailable)))
    }

    this.isValidSwap = function(tile1, tile2) {
      var distance
        , runs

      distance = Math.abs(tile1.x - tile2.x)
               + Math.abs(tile1.y - tile2.y)
      maxRun = Math.max( _grid.verticalRunCount( tile1.x
                                               , tile1.y
                                               , tile2.type
                                               , tile1
                                               , tile2
                                               )
                       , _grid.horizontalRunCount( tile1.x
                                                 , tile1.y
                                                 , tile2.type
                                                 , tile1
                                                 , tile2
                                                 )
                       , _grid.verticalRunCount( tile2.x
                                               , tile2.y
                                               , tile1.type
                                               , tile1
                                               , tile2
                                               )
                       , _grid.horizontalRunCount( tile2.x
                                                 , tile2.y
                                                 , tile1.type
                                                 , tile1
                                                 , tile2
                                                 )
                       )
      return (distance == 1 && maxRun >= 3)
    }

    this.select = function(tile) {
      if(_grid.selectedTile && _grid.selectedTile === tile) {
        _grid.selectedTile.selected(false)
        _grid.selectedTile = null
      }
      else if(_grid.selectedTile) {
        if(_grid.isValidSwap(_grid.selectedTile, tile)) {
          _grid.swapTiles(_grid.selectedTile, tile)
          _grid.selectedTile.selected(false)
          _grid.selectedTile = null
        }
        else {
          _grid.selectedTile.selected(false)
          _grid.selectedTile = null
          alert('invalid move')
        }
      }
      else {
        _grid.selectedTile = tile
        tile.selected(true)
      }
    }

    this.swapTiles = function(tile1, tile2) {
      var tmpx
        , tmpy

      _grid.columns[tile1.x].tiles.splice(tile1.y, 1, tile2)
      _grid.columns[tile2.x].tiles.splice(tile2.y, 1, tile1)

      // ugh
      tmpx = tile1.x
      tmpy = tile1.y
      tile1.x = tile2.x
      tile1.y = tile2.y
      tile2.x = tmpx
      tile2.y = tmpy
    }

    this.findRuns = function() {
      var tiles = []
        , x
        , y
        , count

      _grid.columns.forEach(function(column, x) {
        var y
          , count

        for(y = 0; y < n; y++) {
          count = _grid.verticalRunCount(x, y)
          if(count >= 3) {
            for(j = y; j < y + count; j++) { tiles.push(_grid.getTile(x, j)) }
            y += (count-1)
          }
        }
      })

      for(y = 0; y < n; y++) {
        for(x = 0; x < n; x++) {
          count = _grid.horizontalRunCount(x, y)
          if(count >= 3) {
            for(i = x; i < x + count; i++) { tiles.push(_grid.getTile(i, y)) }
            x += (count-1)
          }
        }
      }

      return _.unique(tiles)
    }

    this.removeTiles = function(tiles) {
      tiles.forEach(function(tile) {
        _grid.columns[tile.x].tiles.splice(tile.y, 1)
        _grid.columns[tile.x].tiles().forEach(function(tile, i) { tile.y = i })
      })
      return tiles.length
    }

    this.findPossibleMoves = function() {
      var x
        , y
        , tile
        , swapTile
        , moves = []

      for(x = 0; x < n; x++) {
        for(y = 0; y < n; y++) {
          tile = _grid.getTile(x, y)
          if(!tile) continue
          if(x < n-1) {
            // check right
            swapTile = _grid.getTile(x+1, y)
            if(!swapTile) continue
            if(_grid.isValidSwap(tile, swapTile)) moves.push([tile, swapTile])
          }
          if(y < n-1) {
            // check down
            swapTile = _grid.getTile(x, y+1)
            if(!swapTile) continue
            if(_grid.isValidSwap(tile, swapTile)) moves.push([tile, swapTile])
          }
        }
      }

      return moves
    }

    this.hint = function() {
      return _.sample(_grid.findPossibleMoves())
    }

    this.highlightTiles = function(tiles) {
      tiles.forEach(function(tile) {
        tile.highlighted(true)
      })
    }

    this.clear = function() {
      _grid.columns.forEach(function(column) {
        column.tiles([])
      })
    }

    ko.computed(function() {
      var tilesToRemove
        , tilesRemoved

      _grid.columns.forEach(function(column, i) {
        if(column.tiles().length < n) {
          window.setTimeout(function() { _grid.addTile(i) }, 0)
        }
      })

      tilesToRemove = _grid.findRuns()
      if(tilesToRemove.length > 0) {
        _grid.highlightTiles(tilesToRemove)
        window.setTimeout(function() {
          tilesRemoved = _grid.removeTiles(tilesToRemove)
          _game.score(_game.score() + tilesRemoved)
        }, 500)
      }
    }).extend({throttle: 150})

    ko.computed(function() {
      var ls = _grid.columns.map(function(c) { return c.tiles().length })
        , possibleMoves = []

      // if it's a full board
      if(ls.reduce(function(x, l){return x + l}) === n*n) {
        possibleMoves = _grid.findPossibleMoves()

        if(possibleMoves.length === 0) {
          alert('game over, no more moves')
        }
      }
    }).extend({throttle: 500})
  }

  this.score = ko.observable(0)
  this.grid = new TileGrid(n)

  this.getHint = function() {
    var hint = _game.grid.hint()
      , tile

    if(!hint) {
      alert('There are no more moves.')
      return
    }

    tile = _.sample(hint)
    tile.highlighted(true)
    window.setTimeout(function() {
      tile.highlighted(false)
    }, 500)
  }

  this.newGame = function() {
    _game.grid.clear()
    _game.score(0)
  }

}

var game = new Game(8, 7)

$(function() {
  ko.applyBindings(game)
})

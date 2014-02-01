function Game(n, types, animDuration) {

  var _game = this

  function Tile(type) {
    var _tile = this
      , classes = ko.observableArray(['tileType'+type])

    this.x = ko.computed(function() {
      return _game.grid.columns.map(function(column) {
        return column.tiles.indexOf(_tile) !== -1
      }).indexOf(true)
    })
    this.y = ko.computed(function() {
      return _tile.x() === -1 ? -1 : _game.grid.columns[_tile.x()]
        .tiles.indexOf(_tile)
    })
    this.type = type

    this.tileClass = ko.computed(function() {
      return classes().join(' ')
    })

    function addClass(className) {
      if(classes.indexOf(className) === -1)
        classes.push(className)
    }

    function removeClass(className) {
      classes.remove(className)
    }

    function animate(animation, done) {
      addClass(animation)
      window.setTimeout(function() {
        removeClass(animation)
        if(done) done()
      }, animDuration)
    }

    this.select = function() {
      addClass('selected')
    }
    this.deselect = function() { removeClass('selected') }
    this.shake = function() { animate('shake') }
    this.highlight = function() { animate('pulse') }

    this.remove = function() {
      var x = _tile.x()
      animate('bounceOut', function() {
        _game.grid.columns[x].tiles.remove(_tile)
      })
    }

    animate('slideInDown')
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

    this.columns = _.range(n).map(function(){return new Column()})
    this.selectedTile = null
    this.swappingLocked = ko.observable(false)

    this.getTile = function(x, y) {
      if(x < 0 || x >= n) return void(0)
      return _grid.columns[x].tiles()[y]
    }

    /* Determines the length of the horizontal run containing the tile at i, j.
       Optionally specify a `type` of the run, otherwise defaults to the type of
       the tile at i, j.
       Optionally specify two tiles to assume they have been swapped.
    */
    this.horizontalRunCount = function(i, j, type, tile1, tile2) {
      var x
        , count = 1
        , tile
        , getTile = function(x, y) {
          if(tile1 && tile2) {
            if(x === tile1.x() && y === tile1.y()) return tile2
            if(x === tile2.x() && y === tile2.y()) return tile1
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

    /* Determines the length of the vertical run containing the tile at i, j.
       Optionally specify a `type` of the run, otherwise defaults to the type of
       the tile at i, j.
       Optionally specify two tiles to assume they have been swapped.
    */
    this.verticalRunCount = function(i, j, type, tile1, tile2) {
      var y
        , count = 1
        , tile
        , getTile = function(x, y) {
          if(tile1 && tile2) {
            if(x === tile1.x() && y === tile1.y()) return tile2
            if(x === tile2.x() && y === tile2.y()) return tile1
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

    /* Add a new tile to column x, but don't allow a run to be created while
       doing so.
    */
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

    /* Determine if swapping tile1 and tile2 is allowed
    */
    this.isValidSwap = function(tile1, tile2) {
      var distance
        , maxRun

      distance = Math.abs(tile1.x() - tile2.x()) +
                 Math.abs(tile1.y() - tile2.y())
      maxRun = Math.max( _grid.verticalRunCount( tile1.x()
                                               , tile1.y()
                                               , tile2.type
                                               , tile1
                                               , tile2
                                               )
                       , _grid.horizontalRunCount( tile1.x()
                                                 , tile1.y()
                                                 , tile2.type
                                                 , tile1
                                                 , tile2
                                                 )
                       , _grid.verticalRunCount( tile2.x()
                                               , tile2.y()
                                               , tile1.type
                                               , tile1
                                               , tile2
                                               )
                       , _grid.horizontalRunCount( tile2.x()
                                                 , tile2.y()
                                                 , tile1.type
                                                 , tile1
                                                 , tile2
                                                 )
                       )
      return (distance === 1 && maxRun >= 3)
    }

    this.select = function(tile) {
      if(_grid.swappingLocked()) return

      if(_grid.selectedTile && _grid.selectedTile === tile) {
        _grid.selectedTile.deselect()
        _grid.selectedTile = null
      }
      else if(_grid.selectedTile) {
        if(_grid.isValidSwap(_grid.selectedTile, tile)) {
          _grid.swapTiles(_grid.selectedTile, tile)
          _grid.selectedTile.deselect()
          _grid.selectedTile = null
        }
        else {
          tile.shake()
          _grid.selectedTile.shake()
          _grid.selectedTile.deselect()
          _grid.selectedTile = null
        }
      }
      else {
        _grid.selectedTile = tile
        tile.select()
      }
    }

    this.swapTiles = function(tile1, tile2) {
      var tile1x = tile1.x()
        , tile1y = tile1.y()
        , tile2x = tile2.x()
        , tile2y = tile2.y()
      _grid.columns[tile1x].tiles.splice(tile1y, 1, tile2)
      _grid.columns[tile2x].tiles.splice(tile2y, 1, tile1)
    }

    /* Computes if the board is full or not
    */
    this.fullBoard = ko.computed(function() {
      return _grid.columns.map(function(c) {
        return c.tiles().length
      }).reduce(function(x, l){return x + l}) === n*n
    })

    /* Finds all runs on the board. Throttled to happen at most every 10 ms.
    */
    this.runs = ko.computed(function() {
      var tiles = []
        , x
        , y
        , i
        , count

      _grid.columns.forEach(function(column, x) {
        var y
          , j
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
    }).extend({throttle: 10})

    /* Finds all valid moves on a board. Throttled to only happen at most every
       one second.
    */
    this.moves = ko.computed(function() {
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
    }).extend({throttle: 1000})

    this.hint = function() {
      return _.sample(_grid.moves())
    }

    this.clear = function() {
      _grid.columns.forEach(function(column) {
        column.tiles([])
      })
    }

    /* If there are less than n tiles in a column, add a tile to that column.
       This is throttled to only allow it to happen at most every 50 ms. This
       gives us our nice "waterfall" effect when tiles fly in from above.
    */
    ko.computed(function() {
      _grid.columns.forEach(function(column, i) {
        if(column.tiles().length < n) {
          window.setTimeout(function() { _grid.addTile(i) }, 0)
        }
      })
    }).extend({throttle: 50})

    /* When the `runs` computed updates, remove all tiles that are a part of any
       runs.  Lock the board while tiles are being removed to prevent tile
       swapping before tiles are done animating out.
    */
    this.runs.subscribe(function(runs) {
      if(runs.length > 0) {
        _game.score(_game.score() + runs.length)
        _grid.swappingLocked(true)
        runs.forEach(function(tile) {
          tile.remove()
        })
        window.setTimeout(function() {
          _grid.swappingLocked(false)
        }, animDuration)
      }
    })

    /* When the `moves` computed updates, check if there are any moves left. If
       not, notify the player and allow them to store their high score.
    */
    this.moves.subscribe(function(moves) {
      if(moves.length === 0) {
        bootbox.dialog( { title: 'Game Over!'
                        , message: 'There are no more moves available.  ' +
                                   'Would you like to save your high score?'
                        , buttons:
                            { success:
                                { label: 'Yes'
                                , className: 'btn-success'
                                , callback: _game.saveScore
                                }
                            , close: { label: 'No thanks' }
                            }
                        }
                      )
      }
    })
  }

  this.score = ko.observable(0)
  this.grid = new TileGrid(n)

  this.getHint = function() {
    var hint = _game.grid.hint()
      , tile

    if(!hint) {
      bootbox.alert('Sorry, there are no more moves.')
      return
    }

    tile = _.sample(hint)
    tile.highlight()
  }

  this.newGame = function() {
    _game.grid.clear()
    _game.score(0)
  }

  this.saveScore = function() {
    bootbox.prompt('What is your name?', function(name) {
      var req

      if(name) {
        req = $.ajax( { contentType: 'application/json'
                      , data: JSON.stringify({ score: _game.score()
                                             , name: name
                                             })
                      , dataType: 'json'
                      , type: 'POST'
                      , url: '/scores'
                      } )

        req.done(function() {
          window.location = '/scores'
        })

        req.fail(function() {
          bootbox.alert('Something went wrong...')
        })
      }
    })
  }

}

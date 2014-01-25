function Game(n, types) {

  function Tile(type) {
    var _self = this

    this.type = type
    this.selected = ko.observable(false)

    this.tileClass = ko.computed(function() {
      return 'tileType' + type + (_self.selected() ? ' selected' : '')
    })

    this.select = function select() {
      _self.selected(true)
    }
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

  this.fillGrid()

}

var game = new Game(5, 4)

$(function() {
  ko.applyBindings(game)
})

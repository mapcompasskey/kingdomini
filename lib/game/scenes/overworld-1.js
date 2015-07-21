ig.module(
    'game.scenes.overworld-1'
)
.requires(
    'impact.game'
)
.defines(function() {

    //
    // --------------------------------------------------------------------------
    // Overworld 1
    // --------------------------------------------------------------------------
    //
    ScreenOverworld1 = ig.Game.extend({
        
        clearColor: '#156d1b',
        isPaused: false,
        tileSize: 10,
        gravity: 0,
        font: new ig.Font('media/04b03.font.png'),
        
        turnCounter: 0,
        tilesName: 'collision',
        tilesWall: null,
        
        // initialize your game here
        init: function() {
            
            // bind keys
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.UP_ARROW, 'up');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
            //ig.input.bind(ig.KEY.X, 'jump');
            //ig.input.bind(ig.KEY.Z, 'attack');
            //ig.input.bind(ig.KEY.C, 'invincible');
            ig.input.bind(ig.KEY.P, 'pause');
            
            this.loadLevel(LevelArea1);
            
            // show collision boxes
            //ig.Entity._debugShowBoxes = true;
            
            // set game width
            this.resizeGame();
            
        },
        
        update: function() {
        
            this.parent();
            
            if (ig.input.pressed('pause'))
            {
                this.isPaused = !this.isPaused;
            }
            
            if (ig.game.isPaused)
            {
                return;
            }
            
            // update camera
            if (this.player)
            {
                if (this.camera)
                {
                    // camera follows the player
                    this.camera.follow(this.player);
                }
                else
                {
                    // center screen on the player
                    this.screen.x = (this.player.pos.x - (ig.system.width / 2));
                    this.screen.y = (this.player.pos.y - (ig.system.height / 2));
                }
            }
            
        },
        
        draw: function() {
            this.parent();
        },
        
        loadLevel: function(data) {
            
            // remember the currently loaded level, so we can reload when the player dies.
            this.currentLevel = data;
            
            // call the parent implemenation. this creates the background maps and entities.
            this.parent(data);
            
            // get background map
            this.tilesWall = ig.game.getMapByName(this.tilesName);
            this.tileSize = this.tilesWall.tilesize;
            
            // setup simple camera plugin
            this.camera = new ig.SimpleCamera(this.tilesName);
            this.camera.offset.x.min = 0;
            this.camera.offset.x.max = 0;
            this.camera.getMinMax();
            
            // spawn player
            //ig.game.spawnEntity(EntityPlayer, (this.tileSize * 5), (this.tileSize * 54));
            
            // add Back button
            var settings = {action:'back', anchor:{top:10, right:5, offset:{x:0, y:0}}, width:43, height:19, imgSrc:'media/button-back.png'};
            this.buttonBack = ig.game.spawnEntity(EntityButton, 0, 0, settings);
            
        },
        
        // check for a tile
        checkForTile: function(entity, x, y) {
            
            // check for an exit tile
            // if (this.checkForExitTile(entity, x, y))
            // {
                // return false;
            // }
            
            var tileX = Math.round(entity.pos.x / this.tileSize) + x;
            var tileY = Math.round(entity.pos.y / this.tileSize) + y;
            if (this.tilesWall.data[tileY])
            {
                if (this.tilesWall.data[tileY][tileX] > 0)
                {
                    return true;
                }
            }
            
            return false;
            
        },
        
        // size the game to the browser
        resizeGame: function() {
            
            // has the game started
            if ( ! ig.system)
            {
                return;
            }
            
            if (this.camera)
            {
                this.camera.getMinMax();
            }
            
        },
        
    });
});
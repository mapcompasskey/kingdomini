ig.module(
    'game.scenes.scene-overworld'
)
.requires(
    'impact.game',
    'game.entities.player-mini'
)
.defines(function() {

    //
    // --------------------------------------------------------------------------
    // Overworld
    // --------------------------------------------------------------------------
    //
    SceneOverworld = ig.Game.extend({
        
        clearColor: '#156d1b',
        isPaused: false,
        tileSize: 10,
        gravity: 0,
        font: new ig.Font('media/04b03.font.png'),
        
        // initialize your game here
        init: function() {
            
            // bind keys
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.UP_ARROW, 'up');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
            ig.input.bind(ig.KEY.P, 'pause');
            
            // load the level data
            if (ig.readyLevel)
            {
                // if (ig.global[ig.readyLevel])
                // {
                    // this.loadLevel(ig.global[ig.readyLevel]);
                // }
                var readyLevel = 'Level' + ig.readyLevel;
                if (ig.global[readyLevel])
                {
                    this.loadLevel(ig.global[readyLevel]);
                }
            }
            
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
            
            // setup simple camera plugin
            this.camera = new ig.SimpleCamera();
            this.camera.offset.x.min = 0;
            this.camera.offset.x.max = 0;
            this.camera.getMinMax();
            
            // default player position
            var xPos = Math.floor(ig.game.collisionMap.width / 2) * this.tileSize;
            var yPos = Math.floor(ig.game.collisionMap.height / 2) * this.tileSize;
            
            // if the exit id has been set by a door entity
            if (ig.readyExitID)
            {
                if (data.entities && data.entities.length)
                {
                    var entity = null;
                    for (var i = 0; i < data.entities.length; i++)
                    {
                        var entity = data.entities[i]
                        if (entity.type == 'EntityDoor')
                        {
                            if (entity.settings.doorID)
                            {
                                if (ig.readyExitID === entity.settings.doorID)
                                {
                                    xPos = entity.x;
                                    yPos = entity.y;// + (this.tileSize);
                                    ig.lastPlayerX = ig.lastPlayerY = 0;
                                }
                            }
                        }
                    }
                }
            }
            
            // if the player's last position is known
            if (ig.lastPlayerX && ig.lastPlayerY)
            {
                xPos = ig.lastPlayerX;// + ((ig.playerFlip ? -1 : 1) * this.tileSize);
                yPos = ig.lastPlayerY;
            }
            
            // spawn player
            ig.game.spawnEntity(EntityPlayerMini, xPos, yPos);
            
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
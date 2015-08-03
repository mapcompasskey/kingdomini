ig.module(
    'game.scenes.scene-village'
)
.requires(
    'impact.game',
    'game.entities.player'
)
.defines(function() {

    //
    // --------------------------------------------------------------------------
    // Village
    // --------------------------------------------------------------------------
    //
    SceneVillage = ig.Game.extend({
        
        clearColor: '#000000',
        isPaused: false,
        tileSize: 20,
        gravity: 400,
        dialog: null,
        font: new ig.Font('media/04b03.font.png'),
        
        // initialize your game here
        init: function() {
            
            // bind keys
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.UP_ARROW, 'up');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
            ig.input.bind(ig.KEY.X, 'jump');
            ig.input.bind(ig.KEY.Z, 'attack');
            ig.input.bind(ig.KEY.C, 'invincible');
            ig.input.bind(ig.KEY.P, 'pause');
            
            // load the level data
            if (ig.readyLevel)
            {
                var readyLevel = 'Level' + ig.readyLevel;
                if (ig.global[readyLevel])
                {
                    this.loadLevel(ig.global[readyLevel]);
                }
            }
            
            // show collision boxes
            // ig.Entity._debugShowBoxes = true;
            
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
            
            // draw text
            var text = 'ARROWS KEY TO MOVE | Z TO ATTACK | X TO JUMP'
            var xPos = (10 - this.screen.x);
            var yPos = (ig.game.collisionMap.pxHeight - this.screen.y - 10);
            this.font.draw(text, xPos, yPos, ig.Font.ALIGN.LEFT);
            
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
            var xPos = 0;
            var yPos = 0;
            
            // if no exit door was defined
            if ( ! ig.readyExitID)
            {
                // facing left - enter from right side
                if (ig.playerFlip)
                {
                    ig.readyExitID = 'right-side';
                }
                // else, facing right - enter from left side
                else
                {
                    ig.readyExitID = 'left-side';
                }
            }
            
            // if the exit door id is known
            if (ig.readyExitID)
            {
                var exitDoor = ig.getExitDoor(data);
                if (exitDoor)
                {
                    xPos = exitDoor.pos.x + (exitDoor.size.x / 2);
                    yPos = exitDoor.pos.y + exitDoor.size.y;
                    
                    if (ig.readyExitID == 'left-side')
                    {
                        xPos = exitDoor.pos.x + (this.tileSize * 2);
                    }
                    else if (ig.readyExitID == 'right-side')
                    {
                        xPos = exitDoor.pos.x - (this.tileSize * 2);
                    }
                }
            }
            
            // spawn player
            ig.game.spawnEntity(EntityPlayer, xPos, yPos);
            
            // spawn dialog
            this.dialog = ig.game.spawnEntity(EntityDialog, 0, 0);
            
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
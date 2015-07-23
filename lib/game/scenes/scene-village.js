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
                if (ig.global[ig.readyLevel])
                {
                    this.loadLevel(ig.global[ig.readyLevel]);
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
            
            // facing left - enter from right side
            if (ig.playerFlip)
            {
                var xPos = (ig.game.collisionMap.width - 5) * this.tileSize;
                var yPos = (ig.game.collisionMap.height - 2) * this.tileSize;
            }
            // else, facing right - enter from left side
            else
            {
                var xPos = this.tileSize * 5;
                var yPos = (ig.game.collisionMap.height - 2) * this.tileSize;
            }
            
            // spawn player
            ig.game.spawnEntity(EntityPlayer, xPos, yPos);
            
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
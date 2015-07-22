ig.module(
	'game.main' 
)
.requires(
    'impact.debug.debug',
	'impact.game',
	'impact.font',
    'plugins.simple-camera',
    'game.scenes.scene-title',
    'game.scenes.overworld-1',
    'game.scenes.village-1',
    'game.scenes.village-2',
    'game.entities.button',
    'game.entities.player-mini'
)
.defines(function(){

    //
    // --------------------------------------------------------------------------
    // Global Variables
    // --------------------------------------------------------------------------
    //
    ig.playerFlip = false; // true = left | false = right
    ig.lastPlayerX = 0;
    ig.lastPlayerY = 0;
    ig.lastOverworldScene = null;
    
    
    
    //
    // --------------------------------------------------------------------------
    // ImpactJS Overrides
    // --------------------------------------------------------------------------
    //
    // override default parallax effect to force y-axis positiong from certain layers
    ig.BackgroundMap.inject({
        setScreenPos: function(x, y) {
            
            /*
            if (this.name == 'horizon')
            {
                this.scroll.x = x / 2;
                this.scroll.y = y + 300;
                return;
            }
            */
            
            this.scroll.x = x / this.distance;
            this.scroll.y = y / this.distance;
            
        }
    });
    
    
    
    //
    // --------------------------------------------------------------------------
    // Fullscreen / Mobile mode
    // --------------------------------------------------------------------------
    //
    ig.gameScale = 1;//(window.innerWidth < 640 ? 2 : 1);
    if (fullscreen || ig.ua.mobile)
    {
        // set the canvas element to the size of the window
        ig.gameCanvas = document.getElementById('canvas');
        ig.gameCanvas.style.width  = window.innerWidth + 'px';
        ig.gameCanvas.style.height = window.innerHeight + 'px';
        
        // on browser resize, update the canvas and game entities
        window.addEventListener('resize', function() {
        
            if ( ! ig.system)
            {
                return;
            }
            
            // resize the canvas
            if (ig.gameCanvas)
            {
                ig.gameCanvas.style.width  = window.innerWidth + 'px';
                ig.gameCanvas.style.height = window.innerHeight + 'px';
                ig.system.resize((window.innerWidth * ig.gameScale), (window.innerHeight * ig.gameScale));
            }
            
            if (ig.game.resizeGame)
            {
                ig.game.resizeGame();
            }
            
        }, false);
    }
    
    
    
    //
    // --------------------------------------------------------------------------
    // Initialize the Game
    // --------------------------------------------------------------------------
    //
    // ig.main('#canvas', SceneTitle, 1, 300, 180, 3);
    ig.main('#canvas', SceneOverworld1, 1, 300, 180, 3);
    // ig.main('#canvas', SceneVillage1, 1, 300, 180, 3);
    
});

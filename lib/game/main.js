ig.module(
	'game.main' 
)
.requires(
    // 'impact.debug.debug',
	'impact.game',
	'impact.font',
    'impact.image',
    
    'plugins.simple-camera',
    
    'game.levels',
    'game.scenes.scene-title',
    'game.scenes.scene-overworld',
    'game.scenes.scene-village',
    
    'game.entities.button',
    'game.entities.door',
    'game.entities.dialog',
    'game.entities.player-mini',
    'game.entities.player',
    'game.entities.npc',
    'game.entities.npc-chicken',
    'game.entities.npc-owl'
)
.defines(function(){

    //
    // --------------------------------------------------------------------------
    // Global Variables
    // --------------------------------------------------------------------------
    //
    ig.playerFlip = false; // true = left | false = right
    
    // ig.readyScene    - the type of scene to load: overworld | level
    // ig.readyLevel    - the name of the level object (JSON data)
    // ig.readyDoorID   - the id of the door in the current scene
    // ig.readyExitID   - the id of the door to exit from in the next scene
    ig.readyScene  = 'village'; //'overworld';
    ig.readyLevel  = 'Village1'; //'Overworld2';
    ig.readyDoorID = 'left-side'; //'overworld-1-a';
    ig.readyExitID = false;
    
    ig.switchScene = function() {
        
        switch (ig.readyScene)
        {
            case 'overworld':
                ig.system.setGame(SceneOverworld);
                break;
            
            case 'village':
                ig.system.setGame(SceneVillage);
                break;
        }
    };
    
    // find a door entity in the level JSON with the matching "doorID"
    ig.getExitDoor = function(data) {
    
        var obj = {
            pos: {x: 0, y: 0},
            size: {x: 0, y: 0}
        };
        
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
                            obj.size.x = 10;
                            obj.size.y = 10;
                            
                            if (entity.settings)
                            {
                                if (entity.settings.size)
                                {
                                    obj.size.x = entity.settings.size.x;
                                    obj.size.y = entity.settings.size.y;
                                }
                            }
                            
                            obj.pos.x = entity.x;
                            obj.pos.y = entity.y;
                        }
                    }
                }
            }
        }
        
        return obj;
    };
    
    
    
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
    
    
    // ig.System.drawMode = ig.System.DRAW.SMOOTH;
    // ig.System.drawMode = ig.System.DRAW.AUTHENTIC;
    // ig.System.drawMode = ig.System.DRAW.SUBPIXEL;
    
    // ig.System.scaleMode = ig.System.SCALE.SMOOTH;
    // ig.System.scaleMode = ig.System.SCALE.CRISP;
    
    
    
    //
    // --------------------------------------------------------------------------
    // Initialize the Game
    // --------------------------------------------------------------------------
    //
    // ig.main('#canvas', SceneTitle, 1, 300, 180, 3);
    
    if (ig.readyScene == 'overworld')
    {
        ig.main('#canvas', SceneOverworld, 1, 300, 180, 4);
    }
    else if (ig.readyScene == 'village')
    {
        ig.main('#canvas', SceneVillage, 1, 300, 180, 4);
    }
    
});

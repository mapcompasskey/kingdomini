ig.module(
    'game.scenes.village-1'
)
.requires(
    'game.scenes.village-base',
    'game.levels.village1'
)
.defines(function() {

    //
    // --------------------------------------------------------------------------
    // Village 1
    // --------------------------------------------------------------------------
    //
    SceneVillage1 = SceneVillageBase.extend({
        
        // initialize your game here
        init: function() {
            this.parent();
            this.loadLevel(LevelVillage1);
        },
        
        update: function() {
            this.parent();
        },
        
        draw: function() {
            this.parent();
        },
        
        loadLevel: function(data) {
            
            this.parent(data);
            
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
        
    });
});
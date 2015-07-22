ig.module(
    'game.scenes.overworld-1'
)
.requires(
    'game.scenes.overworld-base',
    'game.levels.overworld1'
)
.defines(function() {

    //
    // --------------------------------------------------------------------------
    // Overworld 1
    // --------------------------------------------------------------------------
    //
    SceneOverworld1 = SceneOverworldBase.extend({
        
        // initialize your game here
        init: function() {
            this.parent();
            this.loadLevel(LevelOverworld1);
        },
        
        update: function() {
            this.parent();
        },
        
        draw: function() {
            this.parent();
        },
        
        loadLevel: function(data) {
            
            this.parent(data);
            
            // position player
            // var xPos = (ig.game.collisionMap.width - 5) * this.tileSize;
            // var yPos = (ig.game.collisionMap.height - 2) * this.tileSize;
            var xPos = this.tileSize * 25;
            var yPos = this.tileSize * 20;
            
            // spawn player
            ig.game.spawnEntity(EntityPlayerMini, xPos, yPos);
            
        },
        
    });
});
ig.module(
    'game.entities.village-mini'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityVillageMini = ig.Entity.extend({
        
        size: {x: 10, y: 10},
        offset: {x: 0, y: 0},
        animSheet: new ig.AnimationSheet('media/village-mini.png', 10, 10),
        
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NONE,
        _wmIgnore: false,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            
            // add the animations
            this.addAnim('idle', 1, [0], true);
            
        },
        
        update: function() {
            
            if (ig.game.isPaused)
            {
                return;
            }
            
            this.parent();
            
        },
        
        check: function(other) {
            // if (other.switchScene)
            // {
                // other.switchScene(SceneVillage1);
            // }
        },
        
    });
});
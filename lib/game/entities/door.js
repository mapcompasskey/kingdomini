ig.module(
    'game.entities.door'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityDoor = ig.Entity.extend({
        
        size: {x: 10, y: 10},
        offset: {x: 0, y: 0},
        maxVel: {x: 0, y: 0},
        
        // active:  triggers immediately
        // passive: triggers with user input
        // none:    default state
        state: 'none',
        
        canUse: true,
        scene: false,       // overworld | village
        level: false,       // Overworld1 | Village1
        doorID: false,      // left | right | overworld-1-a | overworld-2-a
        exitID: false,      // overworld-1-a | overworld-2-a
        
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NONE,
        
        _wmIgnore: false,
        _wmDrawBox: true,
        _wmScalable: true,
        _wmBoxColor: 'rgba(255, 255, 0, 0.7)',
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },
        
        isDoor: function() {
            return true;
        },
        
        switchScene: function() {
        
            if (this.canUse)
            {
                this.canUse = false;
                
                ig.readyScene  = this.scene;
                ig.readyLevel  = this.level;
                ig.readyDoorID = this.doorID;
                ig.readyExitID = this.exitID;
                
                ig.switchScene();
            }
            
        },
        
    });
});
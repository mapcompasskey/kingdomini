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
        
        scene: '',  // overworld | village
        level: '',  // LevelOverworld1 | LevelVillage1
        doorID: '', // overworld-1-a | overworld-2-a
        exitID: '', // overworld-1-a | overworld-2-a
        
        switching: false,
        
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NONE,
        
        _wmIgnore: false,
        _wmDrawBox: true,
        _wmScalable: true,
        _wmBoxColor: 'rgba(255, 255, 0, 0.7)',
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },
        
        check: function(other) {
        
            if (this.switching)
            {
                return;
            }
            /*
            if (other.checkDoor)
            {
                this.switching = true;
                
                ig.readyScene  = this.scene;
                ig.readyLevel  = this.level;
                ig.readyDoorID = this.doorID;
                ig.readyExitID = this.exitID;
                
                other.checkDoor();
            }
            */
            if (other.checkDoor)
            {
                if (other.canUseDoors)
                {
                    this.switching = true;
                    
                    ig.readyScene  = this.scene;
                    ig.readyLevel  = this.level;
                    ig.readyDoorID = this.doorID;
                    ig.readyExitID = this.exitID;
                    
                    other.checkDoor();
                }
            }
        },
        
    });
});
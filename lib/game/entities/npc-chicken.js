ig.module(
    'game.entities.npc-chicken'
)
.requires(
    'game.entities.npc'
)
.defines(function() {
    EntityNpcChicken = EntityNpc.extend({
        
        size: {x: 22, y: 22},
        offset: {x: 0, y: 0},
        maxVel: {x: 100, y: 220},
        friction: {x: 0, y: 0},
        flip: false,
        speed: 20,
        jump: 220,
        health: 4,
        maxHealth: 4,
        animSheet: new ig.AnimationSheet('media/chicken.png', 22, 22),
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            
            // add the animations
            this.addAnim('idle', 1, [0], true);
            this.addAnim('walk', 0.5, [1, 2]);
            this.addAnim('jump', 1, [1], true);
            this.addAnim('fall', 1, [1], true);
            
            this.sizeReset = this.size;
            this.offsetReset = this.offset;
            this.maxVelReset = this.maxVel;
            
            this.prepareEntity();
        },
        
        check: function(other) {
            // other.receiveDamage(1, this);
        },
        
    });
    
    ig.EntityPool.enableFor(EntityNpcChicken);
});
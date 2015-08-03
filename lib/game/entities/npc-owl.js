ig.module(
    'game.entities.npc-owl'
)
.requires(
    'game.entities.npc'
)
.defines(function() {
    EntityNpcOwl = EntityNpc.extend({
        
        size: {x: 30, y: 30},
        offset: {x: 0, y: 0},
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet('media/npc-owl.png', 30, 30),
        
        _wmIgnore: false,
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },
        
        // update entity action
        updateAction: function() {
            // has no actions
        },
        
        check: function(other) {
            // other.receiveDamage(1, this);
        },
        
        getDialog: function() {
            return this.dialog.slice();
        },
        
    });
    
    ig.EntityPool.enableFor(EntityNpcOwl);
});
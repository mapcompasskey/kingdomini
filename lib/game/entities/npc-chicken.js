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
        animSheet: new ig.AnimationSheet('media/npc-chicken.png', 22, 22),
        
        _wmIgnore: false,
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },
        
        check: function(other) {
            // other.receiveDamage(1, this);
        },
        
        getDialog: function() {
            return this.dialog.slice();
        },
        
    });
    
    ig.EntityPool.enableFor(EntityNpcChicken);
});
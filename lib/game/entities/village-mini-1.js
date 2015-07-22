ig.module(
    'game.entities.village-mini-1'
)
.requires(
    'game.entities.village-mini'
)
.defines(function() {
    EntityVillageMini1 = EntityVillageMini.extend({
        
        _wmIgnore: false,
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },
        
        update: function() {
            this.parent();
        },
        
        check: function(other) {
            if (other.switchScene)
            {
                other.switchScene(SceneVillage1);
            }
        },
        
    });
});
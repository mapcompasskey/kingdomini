ig.module(
    'game.entities.dialog'
)
.requires(
    'impact.entity',
    'impact.font'
)
.defines(function() {
    EntityDialog = ig.Entity.extend({
    
        entity1: null,
        entity2: null,
        talking: false,
        font: new ig.Font('media/04b03.font.png'),
        
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NONE,
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },
        
        update: function() {
        
            if (ig.game.isPaused)
            {
                return;
            }
            
            if (this.talking)
            {
                if (ig.input.state('down'))
                {
                    this.end();
                }
            }
            
            this.parent();
            
        },
        
        draw: function() {
            this.parent();
            
            if (this.talking)
            {
                var text = 'CLUCK! CLUCK!';
                var xPos = Math.floor(ig.system.width / 2);//Math.floor(ig.game.screen.x / 2);
                var yPos = 10;//(10 - ig.game.screen.y);
                this.font.draw(text, xPos, yPos, ig.Font.ALIGN.CENTER);
            }
        },
        
        start: function(entity1, entity2) {
            this.entity1 = entity1;
            this.entity2 = entity2;
            this.entity1.talking = true;
            this.entity2.talking = true;
            this.talking = true;
        },
        
        end: function() {
            this.entity1.talking = false;
            this.entity2.talking = false;
            this.entity1 = null;
            this.entity2 = null;
            this.talking = false;
        },
    
    }); 
});
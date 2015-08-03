ig.module(
    'game.entities.dialog'
)
.requires(
    'impact.entity',
    'impact.font'
)
.defines(function() {
    EntityDialog = ig.Entity.extend({
    
        text: [],
        textIndex: 0,
        entity1: null,
        entity2: null,
        talking: false,
        continueTime: 0.5,
        continueTimer: null,
        canContinueTalking: true,
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
            
            if (this.talking && this.canContinueTalking)
            {
                if (ig.input.released('up'))
                {
                    this.textIndex += 1;
                    if (this.textIndex >= this.text.length)
                    {
                        this.end();
                    }
                    else
                    {
                        this.canContinueTalking = false;
                        this.continueTimer = new ig.Timer(this.continueTime);
                    }
                }
            }
            
            else if ( ! this.canContinueTalking && this.continueTimer)
            {
                if (this.continueTimer.delta() > 0)
                {
                    this.text[this.textIndex] += '\n[UP]';
                    this.continueTimer = null;
                    this.canContinueTalking = true;
                }
            }
            
            this.parent();
            
        },
        
        draw: function() {
            this.parent();
            
            if (this.talking)
            {
                var text = this.text[this.textIndex];
                var xPos = Math.floor(ig.system.width / 2);
                var yPos = 10;
                this.font.draw(text, xPos, yPos, ig.Font.ALIGN.CENTER);
            }
        },
        
        start: function(entity1, entity2) {
            
            this.entity1 = entity1;
            this.entity2 = entity2;
            this.entity1.talking = true;
            this.entity2.talking = true;
            this.talking = true;
            
            if (this.entity2.hasDialog)
            {
                this.text = this.entity2.hasDialog();
                this.textIndex = 0;
                this.canContinueTalking = false;
                this.continueTimer = new ig.Timer(this.continueTime);
            }
            else
            {
                this.end();
            }
            
        },
        
        end: function() {
        
            this.entity1.talking = false;
            this.entity2.talking = false;
            this.entity1 = null;
            this.entity2 = null;
            this.talking = false;
            
            this.text = [];
            this.textIndex = 0;
            this.canContinueTalking = true;
            this.continueTimer = null;
            
        },
    
    }); 
});
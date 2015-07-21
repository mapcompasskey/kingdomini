ig.module(
    'game.entities.player-mini'
)
.requires(
    'impact.entity',
    'plugins.tile-based-movement'
)
.defines(function() {
    EntityPlayerMini = ig.Entity.extend({
        
        size: {x: 10, y: 10},
        offset: {x: 0, y: 0},
        maxVel: {x: 0, y: 0},
        friction: {x: 0, y: 0},
        flip: false,
        speed: 40,
        jump: 0,
        health: 10,
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet('media/player-mini.png', 10, 10),
        
        destination: {x:0, y:0},
        movement: null,
        movingVert: false,
        movingHorz: false,
        
        dying: false,
        hurting: false,
        walking: false,
        
        type: ig.Entity.TYPE.A, // add to friendly group
        checkAgainst: ig.Entity.TYPE.B, // check collisions against enemy group
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            
            // add the animations
            this.addAnim('idle', 1, [0], true);
            this.addAnim('idle_vert', 1, [3], true);
            this.addAnim('walk', 0.2, [1,0,2,0], false);
            this.addAnim('walk_vert', 0.2, [4,3,5,3], false);
            this.addAnim('hurt', 1, [0], true);
            this.addAnim('dead', 1, [0], true);
            
            // game instance of this entity
            ig.game.player = this;
            
            // referrence the tile based movement plugin
            this.movement = new ig.TileBasedMovement(this);
            
            this.maxVel.x = this.speed;
            this.maxVel.y = this.speed;
            
        },
        
        update: function() {
            
            if (ig.game.isPaused)
            {
                return;
            }
            
            this.checkStatus();
            this.parent();
            
            this.movement.update();
            
        },
        
        checkStatus: function() {
            
            // check entity status
            this.isHurting();
            this.isMoving();
            this.animate();
            
        },
        
        // check if hurting
        isHurting: function() {
            
            // if dying, kill this entity when the animation ends
            if (this.dying)
            {
                this.vel.x = 0;
                this.vel.y = 0;
                
                if (this.currentAnim == this.anims.dead)
                {
                    if (this.currentAnim.loopCount)
                    {
                        this.kill();
                    }
                }
            }
            
            // if hurting, stop hurting when the animation ends
            if (this.hurting)
            {
                if (this.currentAnim == this.anims.hurt)
                {
                    if (this.currentAnim.loopCount)
                    {
                        this.hurting = false;
                    }
                }
            }
            
        },
        
        // checking if idle or walking
        isMoving: function() {
            
            // clear old move input
            this.movement.moveIntention = null;
            
            // set movement intention based on input
            if (ig.input.state('right'))
            {
                this.flip = false;
                this.movement.moveIntention = this.movement.moveType.RIGHT;
            }
            else if (ig.input.state('left'))
            {
                this.flip = true;
                this.movement.moveIntention = this.movement.moveType.LEFT;
            }
            else if (ig.input.state('up'))
            {
                this.movement.moveIntention = this.movement.moveType.UP;
            }
            else if (ig.input.state('down'))
            {
                this.movement.moveIntention = this.movement.moveType.DOWN;
            }
            
            // this.movement.update();
            this.vel.x = this.movement.vel.x;
            this.vel.y = this.movement.vel.y;
            
            // update move state
            this.walking = false;
            if (this.vel.x != 0)
            {
                this.walking = true;
                this.movingHorz = true;
                this.movingVert = false;
            }
            else if (this.vel.y != 0)
            {
                this.walking = true;
                this.movingHorz = false;
                this.movingVert = true;
            }
            
        },
        
        // update entity animation
        animate: function() {
            
            // update animation state
            if (this.dying)
            {
                if (this.currentAnim != this.anims.dead)
                {
                    this.currentAnim = this.anims.dead.rewind();
                }
            }
            else if (this.hurting)
            {
                if (this.currentAnim != this.anims.hurt)
                {
                    this.currentAnim = this.anims.hurt.rewind();
                }
            }
            else if (this.walking && this.movingHorz)
            {
                if (this.currentAnim != this.anims.walk)
                {
                    this.currentAnim = this.anims.walk.rewind();
                }
            }
            else if (this.walking && this.movingVert)
            {
                if (this.currentAnim != this.anims.walk_vert)
                {
                    this.currentAnim = this.anims.walk_vert.rewind();
                }
            }
            else
            {
                if (this.movingVert)
                {
                    if (this.currentAnim != this.anims.idle_vert)
                    {
                        this.currentAnim = this.anims.idle_vert.rewind();
                    }
                }
                else
                {
                    if (this.currentAnim != this.anims.idle)
                    {
                        this.currentAnim = this.anims.idle.rewind();
                    }
                }
            }
            
            // update facing direction
            this.currentAnim.flip.x = this.flip;
            
        },
        
        // called when overlapping with an entity whose .checkAgainst property matches this entity
        receiveDamage: function(amount, from) {
        
            if (this.hurting || this.dying)
            {
                return;
            }
            
            return true;
            
        },
        
    });
});
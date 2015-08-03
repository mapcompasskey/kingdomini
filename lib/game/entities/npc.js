ig.module(
    'game.entities.npc'
)
.requires(
    'impact.entity',
    'impact.entity-pool'
)
.defines(function() {
    EntityNpc = ig.Entity.extend({
        
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
        
        idling: false,
        jumping: false,
        falling: false,
        walking: false,
        
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NONE,
        
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
        
        // resurrect from entity pool
        reset: function(x, y, settings) {
            this.parent(x, y, settings);
            this.prepareEntity();
        },
        
        // reset parameters
        prepareEntity: function() {
            
            // reset parameters
            this.size = this.sizeReset
            this.offset = this.offsetReset;
            this.maxVel = this.maxVelReset;
            this.health = this.maxHealth;
            
            this.idling = false;
            this.jumping = false;
            this.falling = false;
            this.walking = false;
            
            // set entity action
            this.updateAction();
        },
        
        update: function() {
        
            if (ig.game.isPaused)
            {
                return;
            }
            
            this.checkStatus();
            this.checkPosition();
            this.parent();
        },
        
        checkStatus: function() {
            
            // if action timer ended
            if (this.actionTimer)
            {
                if (this.actionTimer.delta() > 0)
                {
                    this.updateAction();
                }
            }
            
            // check entity status
            this.isJumping();
            this.isMoving();
            this.animate();
        },
        
        // check if jumping
        isJumping: function() {
            
            // if falling
            if (this.vel.y > 0 && ! this.standing)
            {
                this.falling = true;
                return;
            }
            
            // if standing on something while jumping/falling
            if ((this.jumping || this.falling) && this.standing)
            {
                this.jumping = false;
                this.falling = false;
            }
            
        },
        
        // check if moving
        isMoving: function() {
            
            if (this.walking)
            {
                this.vel.x = this.speed * (this.flip ? -1 : 1);
            }
            else
            {
                this.vel.x = 0;
            }
            
        },
        
        // update entity animation
        animate: function() {
            
            // update animation state
            if (this.falling)
            {
                if (this.currentAnim != this.anims.fall)
                {
                    this.currentAnim = this.anims.fall.rewind();
                }
            }
            else if (this.jumping)
            {
                if (this.currentAnim != this.anims.jump)
                {
                    this.currentAnim = this.anims.jump.rewind();
                }
            }
            else if (this.walking)
            {
                if (this.currentAnim != this.anims.walk)
                {
                    this.currentAnim = this.anims.walk.rewind();
                }
            }
            else {
                if (this.currentAnim != this.anims.idle)
                {
                    this.currentAnim = this.anims.idle.rewind();
                }
            }
            
            // update facing direction
            this.currentAnim.flip.x = this.flip;
        },
        
        // check if this entity needs repositioned
        checkPosition: function() {
            
            // if entity has reached the edge of a platform
            if ( ! this.jumping && ! this.falling)
            {
                var xPos = this.pos.x + (this.flip ? -1 : this.size.x + 1);
                var yPos = (this.pos.y + this.size.y + 1);
                if ( ! ig.game.collisionMap.getTile(xPos, yPos))
                {
                    this.flip = !this.flip;
                    this.vel.x = (this.vel.x > 0 ? -this.vel.x : this.vel.x);
                }
            }
            
            // if this entity has moved off the map
            if (this.pos.x < ig.game.camera.offset.x.min)
            {
                this.pos.x = (ig.game.collisionMap.pxWidth - ig.game.camera.offset.x.max - (this.size.x * 2));
            }
            else if ((this.pos.x + this.size.x) > (ig.game.collisionMap.pxWidth - ig.game.camera.offset.x.max))
            {
                this.pos.x = (ig.game.camera.offset.x.min + this.size.x);
            }
            
            // if this entity has fallen off the map
            if (this.pos.y > ig.game.collisionMap.pxHeight)
            {
                this.pos.y = 0;
            }
            
        },
        
        // update entity action
        updateAction: function() {
            
            // get a random number 1 - 5
            var num = Math.floor((Math.random() * 5) + 1);
            switch (num)
            {
                // walk right
                case 5:
                case 4:
                    this.flip = false;
                    this.walking = true;
                    break;
                
                // walk left
                case 3:
                case 2:
                    this.flip = true;
                    this.walking = true;
                    break;
                
                // stand still
                default:
                    this.walking = false;
            }
            
            // reset action timer to 1 - 5 seconds
            var timer = Math.floor((Math.random() * 5) + 1);
            this.actionTimer = new ig.Timer(timer);
        },
        
        check: function(other) {
            // other.receiveDamage(1, this);
        },
        
    });
    
    ig.EntityPool.enableFor(EntityNpc);
});
ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity',
    'game.entities.player-sword'
)
.defines(function() {
    EntityPlayer = ig.Entity.extend({
        
        size: {x: 8, y: 24},
        offset: {x: 36, y: 24},
        maxVel: {x: 110, y: 220},
        friction: {x: 0, y: 0},
        flip: false,
        speed: 100,
        jump: 220,
        health: 6,
        maxHealth: 6,
        animSheet: new ig.AnimationSheet('media/player.png', 80, 48),
        
        isInvincible: false,
        speedMultiplier: 1,
        
        activeDoor: null,
        canUseDoors: true,
        isUsingDoor: false,
        
        activeNPC: null,
        canUseNPC: true,
        isUsingNPC: false,
        
        switching: false,
        walking: false,
        jumping: false,
        falling: false,
        hurting: false,
        crouching: false,
        dying: false,
        attacking: false,
        attack_1: false,
        attack_jump: false,
        talking: false,
        wasTalking: false,
        
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        _wmIgnore: true,
        
        init: function(x, y, settings) {
        
            // reposition player
            x = x - (this.size.x / 2);
            y = y - this.size.y;
            
            this.parent(x, y, settings);
            
            // add the animations
            this.addAnim('idle', 1, [0], true);
            this.addAnim('crouch', 1, [6], true);
            this.addAnim('walk', 0.3, [1, 2, 1, 3]);
            this.addAnim('jump', 1, [4], true);
            this.addAnim('fall', 1, [5], true);
            this.addAnim('hurt', 0.3, [5], true);
            this.addAnim('dead', 0.5, [5], true);
            this.addAnim('attack1', 0.1, [8, 9, 10], true);
            this.addAnim('attackJump', 0.1, [12, 13, 14], true);
            
            // game instance of this entity
            ig.game.player = this;
            
            // update direction facing
            this.flip = (ig.playerFlip ? ig.playerFlip : false);
            
        },
        
        update: function() {
            
            if (ig.game.isPaused)
            {
                return;
            }
            
            if (this.talking)
            {
                return;
            }
            
            this.checkStatus();
            this.checkPosition();
            this.parent();
                        
            // update sword
            this.updatePlayerSword();
            
            // reset variables
            this.activeNPC  = null;
            this.activeDoor = null;
            
        },
        
        checkStatus: function() {
        
            // update direction facing
            if ( ! this.hurting && ! this.dying)
            {
                if (ig.input.state('left'))
                {
                    this.flip = true;
                }
                else if (ig.input.state('right'))
                {
                    this.flip = false;
                }
            }
            
            // toggle invincibility
            if (ig.input.pressed('invincible'))
            {
                this.isInvincible = this.isInvincible ? false : true;
            }
            
            // check entity status
            this.isTouchingNPC();
            this.isTouchingDoor();
            this.isTalking();
            this.isHurting();
            this.isCrouching();
            this.isAttacking();
            this.isJumping();
            this.isMoving();
            this.animate();
            
        },
        
        // check if touching a NPC entity
        isTouchingNPC: function() {
        
            if (this.canUseNPC && this.activeNPC)
            {
                if (this.activeNPC.hasDialog)
                {
                    if (ig.input.released('up'))
                    {
                        if (ig.game.dialog)
                        {
                            ig.game.dialog.start(this, this.activeNPC);
                        }
                    }
                }
            }
            
        },
        
        // check if touching a door entity
        isTouchingDoor: function() {
            
            if (this.canUseDoors && this.activeDoor)
            {
                if (this.activeDoor.state == 'active')
                {
                    this.isUsingDoor = true;
                    this.canUseDoors = false;
                        
                    ig.playerFlip = this.flip;
                    
                    this.activeDoor.switchScene();
                }
                else if (this.activeDoor.state == 'passive')
                {
                    if (ig.input.released('up'))
                    {
                        this.isUsingDoor = true;
                        this.canUseDoors = false;
                        
                        ig.playerFlip = this.flip;
                        
                        this.activeDoor.switchScene();
                    }
                }
            }
            
        },
        
        isTalking: function() {
        
            if (this.talking && ! this.wasTalking)
            {
                this.isUsingNPC = true;
                this.canUseNPC  = false;
                this.wasTalking = true;
            }
            
            if ( ! this.talking && this.wasTalking)
            {
                this.isUsingNPC = false;
                this.canUseNPC  = true;
                this.wasTalking = false;
            }
            
        },
        
        // check if hurting
        isHurting: function() {
            
            // if dying, kill this entity when the animation ends
            if (this.dying)
            {
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
        
        // check if crouching
        isCrouching: function() {
            
            if (this.hurting || this.dying || this.jumping || this.falling || this.attacking)
            {
                return;
            }
            
            // if standing on something and just pressed "DOWN" button
            if ( ! this.crouching)
            {
                if (this.standing && ig.input.state('down'))
                {
                    this.crouching = true;
                    this.vel.x = 0;
                    this.updateCollisionBox();
                    return;
                }
            }
            
            // else, if crouching and no longer pressing "DOWN" button
            else
            {
                if ( ! ig.input.state('down'))
                {
                    this.crouching = false;
                    this.updateCollisionBox();
                }
            }
            
        },
        
        // check if attacking
        isAttacking: function() {
            
            if (this.hurting || this.dying || this.crouching)
            {
                this.attacking = false;
                return;
            }
            
            // if attacking 1
            if (this.attacking && this.attack_1)
            {
                if (this.currentAnim == this.anims.attack1)
                {
                    if (this.sword)
                    {
                        if (this.currentAnim.frame > 1)
                        {
                            this.sword.canDamage = true;
                        }
                        else
                        {
                            this.sword.canDamage = false;
                        }
                    }
                    
                    if (this.currentAnim.loopCount)
                    {
                        this.attack_1 = false;
                        this.attacking = false;
                        if (this.sword)
                        {
                            this.sword.attack_1 = false;
                            this.sword.updateCollisionBox();
                        }
                    }
                }
            }
            
            // if jump attack
            if (this.attacking && this.attack_jump)
            {
                if (this.currentAnim == this.anims.attackJump)
                {
                    if (this.sword)
                    {
                        if (this.currentAnim.frame > 1)
                        {
                            this.sword.canDamage = true;
                        }
                        else
                        {
                            this.sword.canDamage = false;
                        }
                    }
                    
                    if (this.currentAnim.loopCount)
                    {
                        this.attack_jump = false;
                        if (this.sword)
                        {
                            this.sword.attack_jump = false;
                            this.sword.updateCollisionBox();
                        }
                        this.attacking = false;
                    }
                }
            }
            
            // is attack button pressed
            if ( ! this.attacking)
            {
                if (ig.input.pressed('attack'))
                {
                    // add player sword entity
                    this.sword = ig.game.spawnEntity(EntityPlayerSword, 0, 0);
                    
                    // if jumping/falling
                    if (this.jumping || this.falling)
                    {
                        this.attacking = true;
                        this.attack_jump = true;
                        this.sword.attack_jump = true;
                    }
                    // else, normal attack
                    else
                    {
                        this.attacking = true;
                        this.attack_1 = true;
                        this.sword.attack_1 = true;
                    }
                    
                    this.sword.updateCollisionBox();
                }
            }
            
        },
        
        // check if jumping
        isJumping: function() {
        
            if (this.hurting || this.dying || this.crouching)
            {
                this.jumping = false;
                this.falling = false;
                return;
            }
            
            // if standing on something and just pressed "JUMP" button
            if (this.standing && ig.input.pressed('jump'))
            {
                this.jumping = true;
                this.vel.y = -this.jump;
                return;
            }
            
            // reduce jumping height
            if (this.jumping && ig.input.released('jump'))
            {
                this.vel.y = (this.vel.y / 2);
            }
            
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
        
        // checking if idle or moving left/right
        isMoving: function() {
        
            if (this.hurting || this.dying || this.crouching)
            {
                this.walking = false;
                return;
            }
            
            // reduce speed if attacking
            this.speedMultiplier = 1;
            if (this.attacking && ! this.jumping && ! this.falling)
            {
                this.speedMultiplier = 0.5;
            }
            
            // if moving left
            if (ig.input.state('left'))
            {
                this.walking = true;
                this.vel.x = -(this.speed * this.speedMultiplier);
            }
            // else, if moving right
            else if (ig.input.state('right'))
            {
                this.walking = true;
                this.vel.x = (this.speed * this.speedMultiplier);
            }
            // else, if standing still
            else
            {
                this.walking = false;
                this.vel.x = 0;
            }
            
        },
        
        // update entity animation
        animate: function() {
            
            // update entitiy opacity
            if (this.hurting || this.isInvincible)
            {
                this.currentAnim.alpha = 0.5;
            }
            else if (this.currentAnim.alpha < 1)
            {
                this.currentAnim.alpha = 1;
            }
            
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
            else if (this.crouching)
            {
                if (this.currentAnim != this.anims.crouch)
                {
                    this.currentAnim = this.anims.crouch.rewind();
                }
            }
            else if (this.attacking)
            {
                if (this.attack_jump)
                {
                    if (this.currentAnim != this.anims.attackJump)
                    {
                        this.currentAnim = this.anims.attackJump.rewind();
                    }
                }
                else if (this.attack_1)
                {
                    if (this.currentAnim != this.anims.attack1)
                    {
                        this.currentAnim = this.anims.attack1.rewind();
                    }
                }
            }
            else if (this.falling)
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
            else
            {
                if (this.currentAnim != this.anims.idle)
                {
                    this.currentAnim = this.anims.idle.rewind();
                }
            }
            
            // update facing direction
            this.currentAnim.flip.x = this.flip;
        },
        
        // update player sword
        updatePlayerSword: function() {
            
            if (this.sword)
            {
                // update sword position
                if (this.attacking)
                {
                    this.sword.updatePosition(this);
                }
                // else, remove the sword
                else
                {
                    this.sword.kill();
                    this.sword = null;
                }
            }
        },
        
        // check if this entity needs repositioned
        checkPosition: function() {
            
            // if this entity has moved off the left side of the map
            if (this.pos.x < ig.game.camera.offset.x.min)
            {
                this.pos.x = (ig.game.collisionMap.pxWidth - ig.game.camera.offset.x.max - (this.size.x * 2));
            }
            
            // else, if the entity has moved off the right side of the map
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
        
        // update the size of the collision box
        updateCollisionBox: function() {
            
            if (this.crouching)
            {
                this.size.x = 8;
                this.size.y = 16;
                this.offset.x = 36;
                this.offset.y = 32;
                this.pos.y += 8;
            }
            else
            {
                this.size.x = 8;
                this.size.y = 24;
                this.offset.x = 36;
                this.offset.y = 24;
                this.pos.y -= 8;
            }
            
        },
        
        // called during entity collision
        check: function(other) {
            
            // if colliding with a NPC
            if (other.isNPC)
            {
                this.activeNPC = other;
                return;
            }
            
            // if colliding with a door
            if (other.isDoor)
            {
                this.activeDoor = other;
                return;
            }
            
        },
        
        // called when overlapping with an entity whose .checkAgainst property matches this entity
        receiveDamage: function(amount, from) {
        
            if (this.hurting || this.dying || this.isInvincible)
            {
                return;
            }
            
            /*
            // reduce health
            this.health -= amount;
            
            // if dead
            if (this.health <= 0) {
                this.vel.x = 0;
                this.vel.y = 0;
                this.maxVel.x = 0;
                this.maxVel.y = 0;
                this.dying = true;
                return true;
            }
            
            // update state
            this.hurting = true;
            
            // apply knockback
            this.vel.x = (from.pos.x > this.pos.x) ? -200 : 200;
            this.vel.y = -150;
            */
            
            return true;
        },
        
    });
});
/**
 * Grid-based movement in ImpactJS.
 * https://github.com/Joncom/impact-grid-movement
*/

ig.module(
    'plugins.tile-based-movement'
)
.defines(function(){ "use strict";
    ig.TileBasedMovement = ig.Class.extend({
        
        entity: null,
        destination: null,
        lastMove: null,
        moveIntention: null,
        tileCounter: 0,
        vel: {x: 0, y: 0},
        moveType: {
            'UP': 1,
            'DOWN': 2,
            'LEFT': 4,
            'RIGHT': 8
        },
        
        init: function(entity) {
            this.entity = entity;
        },
        
        update: function() {
        
            // stop the moving entity if at the destination
            if (this.isMoving() && this.justReachedDestination() && ! this.moveIntention)
            {
                this.stopMoving();
            }
            
            // stop the moving entity when it hits a wall
            else if (this.isMoving() && this.justReachedDestination() && this.moveIntention && ! this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention))
            {
                this.stopMoving();
            }
            
            // destination reached, but set new destination and keep going
            else if (this.isMoving() && this.justReachedDestination() && this.moveIntention && this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention) && this.moveIntention === this.lastMove)
            {
                this.continueMovingFromDestination();
            }
            
            // destination reached, but changing direction and continuing
            else if (this.isMoving() && this.justReachedDestination() && this.moveIntention && this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention) && this.moveIntention !== this.lastMove)
            {
                this.changeDirectionAndContinueMoving(this.moveIntention);
            }
            
            // destination not yet reached, so keep going
            else if (this.isMoving() && ! this.justReachedDestination())
            {
                this.continueMovingToDestination();
            }
            
            // not moving
            else if ( ! this.isMoving() && this.moveIntention && this.canMoveDirectionFromCurrentTile(this.moveIntention))
            {
                this.startMoving(this.moveIntention);
            }
            
        },
        
        getCurrentTile: function() {
        
            var tilesize = ig.game.collisionMap.tilesize;
            
            var tileX = this.entity.pos.x / tilesize;
            var tileY = this.entity.pos.y / tilesize;
            
            return {
                x: tileX,
                y: tileY
            };
            
        },
        
        getTileAdjacentToTile: function(tileX, tileY, direction) {
            
            if (direction === this.moveType.UP)
            {
                tileY += -1;
            }
            else if (direction === this.moveType.DOWN)
            {
                tileY += 1;
            }
            else if (direction === this.moveType.LEFT)
            {
                tileX += -1;
            }
            else if (direction === this.moveType.RIGHT)
            {
                tileX += 1;
            }
            
            return {
                x: tileX,
                y: tileY
            };
            
        },
        
        startMoving: function(direction) {
        
            // get current tile position
            var currTile = this.getCurrentTile();
            
            // get new destination
            this.destination = this.getTileAdjacentToTile(currTile.x, currTile.y, direction);
            
            // move
            this.setVelocityByTile(this.destination.x, this.destination.y, this.entity.speed);
            
            // remember this move for later
            this.lastMove = direction;
            
        },
        
        continueMovingToDestination: function() {
            
            // move
            this.setVelocityByTile(this.destination.x, this.destination.y, this.entity.speed);
            
        },
        
        continueMovingFromDestination: function() {
        
            // get new destination
            this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, this.lastMove);
            
            // move
            this.setVelocityByTile(this.destination.x, this.destination.y, this.entity.speed);
            
        },
        
        changeDirectionAndContinueMoving: function(newDirection) {
        
            // method only called when at destination, so snap to it now
            this.snapToTile(this.destination.x, this.destination.y);
            
            // get new destination
            this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, newDirection);
            
            // move
            this.setVelocityByTile(this.destination.x, this.destination.y, this.entity.speed);
            
            // remember this move for later
            this.lastMove = newDirection;
            
        },
        
        stopMoving: function() {
        
            // method only called when at destination, so snap to it now
            this.snapToTile(this.destination.x, this.destination.y);
            
            // we are already at the destination
            this.destination = null;
            
            // stop
            //this.entity.vel.x = this.entity.vel.y = 0;
            this.vel.x = this.vel.y = 0;
            
        },
        
        snapToTile: function(x, y) {
        
            var tilesize = ig.game.collisionMap.tilesize;
            this.entity.pos.x = x * tilesize;
            this.entity.pos.y = y * tilesize;
            
        },
        
        justReachedDestination: function() {
        
            var tilesize = ig.game.collisionMap.tilesize;
            var destinationX = this.destination.x * tilesize;
            var destinationY = this.destination.y * tilesize;
            var result = (
                (this.entity.pos.x >= destinationX && this.entity.last.x < destinationX) ||
                (this.entity.pos.x <= destinationX && this.entity.last.x > destinationX) ||
                (this.entity.pos.y >= destinationY && this.entity.last.y < destinationY) ||
                (this.entity.pos.y <= destinationY && this.entity.last.y > destinationY)
            );
            
            if (result)
            {
                this.tileCounter++;
            }
            
            return result;
            
        },
        
        isMoving: function() {
        
            return this.destination !== null;
            
        },
        
        canMoveDirectionFromTile: function(tileX, tileY, direction) {
        
            var newPos = this.getTileAdjacentToTile(tileX, tileY, direction);
            return ig.game.collisionMap.data[newPos.y][newPos.x] === 0;
            
        },
        
        canMoveDirectionFromCurrentTile: function(direction) {
        
            var currTile = this.getCurrentTile();
            return this.canMoveDirectionFromTile(currTile.x, currTile.y, direction);
            
        },
        
        // sets the velocity of the entity so that it will move toward the tile
        setVelocityByTile: function(tileX, tileY, velocity) {
            
            var tilesize = ig.game.collisionMap.tilesize;
            
            var tileCenterX = tileX * tilesize + tilesize/2;
            var tileCenterY = tileY * tilesize + tilesize/2;
            
            var entityCenterX = this.entity.pos.x + this.entity.size.x / 2;
            var entityCenterY = this.entity.pos.y + this.entity.size.y / 2;
            
            this.vel.x = this.vel.y = 0;
            
            if (entityCenterX > tileCenterX)
            {
                this.vel.x = -velocity;
            }
            else if (entityCenterX < tileCenterX)
            {
                this.vel.x = velocity;
            }
            else if (entityCenterY > tileCenterY)
            {
                this.vel.y = -velocity;
            }
            else if (entityCenterY < tileCenterY)
            {
                this.vel.y = velocity;
            }
            
        },
    
    });
});
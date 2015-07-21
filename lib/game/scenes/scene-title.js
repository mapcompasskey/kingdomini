ig.module(
    'game.scenes.scene-title'
)
.requires(
    'impact.game'
)
.defines(function() {

    //
    // --------------------------------------------------------------------------
    // Title Scene
    // --------------------------------------------------------------------------
    //
    SceneTitle = ig.Game.extend({
        
        clearColor: '#156d1b',
        tileSize: 10,
        gravity: 400,
        buttonStart: null,
        font: new ig.Font('media/04b03.font.png'),
        
        logo: {
            pos: {x: 0, y: 0},
            img: new ig.Image('media/kingdomini.png')
        },
        
        // initialize your game here
        init: function() {
            
            // bind keys
            ig.input.bind(ig.KEY.A, 'left');
            ig.input.bind(ig.KEY.D, 'right');
            ig.input.bind(ig.KEY.MOUSE1, 'click');
            
            // show collision boxes
            //ig.Entity._debugShowBoxes = true;
            
            // add Start button
            var settings = {action:'start', anchor:{bottom:10, right:10, offset:{x:0, y:0}}, width:50, height:19, imgSrc:'media/button-start.png'};
            this.buttonStart = ig.game.spawnEntity(EntityButton, 0, 0, settings);
            
            // set game width
            this.resizeGame();
            
        },
        
        update: function() {
            
            this.parent();
            
            // if Start button is pressed
            this.buttonStart.update();
            if (ig.input.released('start'))
            {
                ig.system.setGame(SceneOverworld1);
            }
            
        },
        
        draw: function() {
            
            this.parent();
            
            // draw logo
            this.logo.img.draw(this.logo.pos.x, this.logo.pos.y);
            
            // draw text
            //var text = 'You\'re a lowly slime.\nAdventures are raiding your home.\nFind a way to defeat them.';
            //text += '\n\nCLICK to jump.\nCLICK and HOLD to attack.';
            //this.font.draw(text, (ig.system.width / 2), 70, ig.Font.ALIGN.CENTER);
            
            // draw Start button
            this.buttonStart.draw(true);
            
        },
        
        // reposition entities
        resizeGame: function() {
        
            // has the game started
            if ( ! ig.system)
            {
                return;
            }
            
            // update logo position
            this.logo.pos.x = ((ig.system.width / 2) - (this.logo.img.width / 2));
            this.logo.pos.y = 20;
            
            // reposition Start button
            this.buttonStart.align();
            
        },
        
    });
});
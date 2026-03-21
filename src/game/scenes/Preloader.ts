import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(512, 384, 'background');
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);
        
        const loadingText = this.add.text(512, 420, 'Loading Ghibli World...', {
            fontFamily: 'Arial', fontSize: '18px', color: '#ffffff'
        }).setOrigin(0.5);

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
            if (progress > 0.7) loadingText.setText('Preparing Music...');
        });
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
        
        // Load with no cache-busting to avoid download manager interception
        this.load.audio('bg-music', 'music.mp3');
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}

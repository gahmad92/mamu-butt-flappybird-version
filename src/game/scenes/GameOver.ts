import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Rectangle;
    gameOverText: Phaser.GameObjects.Text;
    restartText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xFFAB91);

        this.gameOverText = this.add.text(width / 2, height / 2 - 50, 'MAMU BUTT NEEDS A REST', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#455A64', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.restartText = this.add.text(width / 2, height / 2 + 50, 'Click to try again', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#455A64', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        EventBus.emit('current-scene-ready', this);
    }
}

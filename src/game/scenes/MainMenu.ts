import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    background: GameObjects.Rectangle;
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    character: GameObjects.Container;
    vehicleEmoji: GameObjects.Text;

    musicToggle: GameObjects.Text;
    isMusicMuted: boolean = false;

    vehicles = ['🛹', '🛺', '🛸', '⛵', '🛵', '🛋️', '☁️'];
    currentVehicleIndex = 0;

    constructor() {
        super('MainMenu');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.cameras.main.setBackgroundColor(0x81D4FA);

        // Character Preview
        const mamu = this.add.text(0, -20, '🧔', { fontSize: '80px' }).setOrigin(0.5);
        this.vehicleEmoji = this.add.text(0, 30, this.vehicles[this.currentVehicleIndex], { fontSize: '60px' }).setOrigin(0.5);

        this.character = this.add.container(width / 2, height / 2 - 50, [this.vehicleEmoji, mamu]);
        this.character.setSize(120, 150);
        this.character.setInteractive({ useHandCursor: true });

        this.add.text(width / 2, height / 2 + 50, 'Click Mamu to Change Ride', {
            fontFamily: 'Arial', fontSize: '18px', color: '#455A64'
        }).setOrigin(0.5);

        // Save default choice to registry immediately
        this.registry.set('vehicleIndex', this.currentVehicleIndex);

        this.character.on('pointerdown', () => {
            this.currentVehicleIndex = (this.currentVehicleIndex + 1) % this.vehicles.length;
            this.vehicleEmoji.setText(this.vehicles[this.currentVehicleIndex]);
            this.registry.set('vehicleIndex', this.currentVehicleIndex);
            this.tweens.add({ targets: this.character, scale: 1.2, duration: 100, yoyo: true });
        });

        // Floating animation
        this.tweens.add({
            targets: this.character, y: height / 2 - 80, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        this.title = this.add.text(width / 2, height / 2 + 120, 'MAMU BUTT ADVENTURE', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff', stroke: '#455A64', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5);

        this.subtitle = this.add.text(width / 2, height / 2 + 200, 'Start Adventure', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff', stroke: '#455A64', strokeThickness: 4,
            align: 'center', backgroundColor: '#FFAB91', padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Robust Music Toggle
        this.musicToggle = this.add.text(width - 50, height - 50, '🎵 ON', {
            fontFamily: 'Arial Black', fontSize: '20px', color: '#ffffff', stroke: '#455A64', strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.musicToggle.on('pointerdown', () => {
            this.isMusicMuted = !this.isMusicMuted;
            this.musicToggle.setText(this.isMusicMuted ? '🔇 OFF' : '🎵 ON');
            if (this.isMusicMuted) this.sound.stopAll();
            else this.playMusic();
        });

        this.subtitle.on('pointerdown', () => {
            if (!this.isMusicMuted) this.playMusic();
            this.scene.start('Game', { vehicleIndex: this.currentVehicleIndex });
        });

        EventBus.emit('current-scene-ready', this);
    }

    playMusic() {
        if (this.sound.context.state === 'suspended') {
            this.sound.context.resume();
        }

        const music = this.sound.get('bg-music');
        if (!music) {
            this.sound.play('bg-music', { loop: true, volume: 0.5 });
        } else if (!music.isPlaying) {
            music.play();
        }
    }
}

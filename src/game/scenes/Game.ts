import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    player: Phaser.GameObjects.Container;
    playerEmoji: Phaser.GameObjects.Text;
    vehicleEmoji: Phaser.GameObjects.Text;
    hatEmoji: Phaser.GameObjects.Text;
    companionEmoji: Phaser.GameObjects.Text;
    
    // Parallax Backgrounds
    skyBg: Phaser.GameObjects.Rectangle;
    clouds: Phaser.GameObjects.Group;
    hillsDist: Phaser.GameObjects.Group;
    hillsNear: Phaser.GameObjects.Group;
    detailAssets: Phaser.GameObjects.Group;
    skyAssets: Phaser.GameObjects.Group;
    
    pillars: Phaser.Physics.Arcade.Group;
    
    score: number = 0;
    scoreText: Phaser.GameObjects.Text;
    
    level: number = 1;
    levelText: Phaser.GameObjects.Text;
    
    spawnTimer: Phaser.Time.TimerEvent;
    
    isGameOver: boolean = false;
    isPaused: boolean = false;
    isTransitioning: boolean = false;
    isTourMode: boolean = false; // "Cheat" mode
    
    pauseText: Phaser.GameObjects.Text;
    pauseButton: Phaser.GameObjects.Text;
    tourText: Phaser.GameObjects.Text;
    
    // Vehicle Options
    vehicles = ['🛹', '🛺', '🛸', '⛵', '🛵', '🛋️'];
    actualVehicles = ['🛹', '🛺', '🛸', '⛵', '🛵', '🛋️'];
    currentVehicleIndex = 0;
    
    // 20 LEVEL BIOMES (Ghibli Palettes)
    levelData = [
        { name: "Jungle Village", sky: 0x81D4FA, pillar: 0xA5D6A7, dist: 0xC8E6C9, near: 0x81C784, details: ['🏘️', '🎡', '🌳'], skyDetails: [], hat: '👒' },
        { name: "Snowy Mountains", sky: 0xE1F5FE, pillar: 0xB3E5FC, dist: 0xE1F5FE, near: 0x90CAF9, details: ['🛖', '🌲', '🏔️'], skyDetails: [], hat: '🧶' },
        { name: "Night City", sky: 0x1A237E, pillar: 0x4A148C, dist: 0x0D47A1, near: 0x1565C0, details: ['🏙️', '🏮', '🗼'], skyDetails: ['🦅', '✈️'], hat: '🎩' },
        { name: "Sakura Valley", sky: 0xFCE4EC, pillar: 0xF48FB1, dist: 0xF8BBD0, near: 0xF06292, details: ['🌸', '🏯', '🍡'], skyDetails: ['🦅', '🚁'], hat: '💮' },
        { name: "Golden Wheat", sky: 0xFFF9C4, pillar: 0xFFF176, dist: 0xFFF59D, near: 0xFBC02D, details: ['🌾', '🏠', '🚜', '🦌'], skyDetails: ['🦅'], hat: '👒' },
        { name: "Lavender Mist", sky: 0xF3E5F5, pillar: 0xCE93D8, dist: 0xE1BEE7, near: 0xBA68C8, details: ['🪻', '⛲', '🦋', '🐎'], skyDetails: ['🦅'], hat: '👒' },
        { name: "Autumn Forest", sky: 0xFFF3E0, pillar: 0xFFB74D, dist: 0xFFE0B2, near: 0xFB8C00, details: ['🍁', '🍄', '🦊'], skyDetails: ['🦅', '✈️'], hat: '👒' },
        { name: "Coral Reef", sky: 0xE0F7FA, pillar: 0x4DD0E1, dist: 0xB2EBF2, near: 0x00ACC1, details: ['🐚', '🐙', '🌊', '🐳'], skyDetails: ['🛸'], hat: '🤿' },
        { name: "Bamboo Grove", sky: 0xF1F8E9, pillar: 0xAED581, dist: 0xDCEDC8, near: 0x7CB342, details: ['🎋', '🎍', '🐼'], skyDetails: ['🦅'], hat: '👒' },
        { name: "Rose Garden", sky: 0xFFEBEE, pillar: 0xE57373, dist: 0xFFCDD2, near: 0xD32F2F, details: ['🌹', '🥀', '🏰'], skyDetails: ['🦅', '🚁'], hat: '👑' },
        { name: "Emerald Lake", sky: 0xE0F2F1, pillar: 0x80CBC4, dist: 0xB2DFDB, near: 0x00897B, details: ['🦢', '🚣', '🍃'], skyDetails: ['🦅'], hat: '👒' },
        { name: "Starry Night", sky: 0x0D47A1, pillar: 0x311B92, dist: 0x1A237E, near: 0x4527A0, details: ['⭐', '🌌', '🔭'], skyDetails: ['🐉', '🛸'], hat: '👨‍🚀' },
        { name: "Volcanic Ash", sky: 0xEFEBE9, pillar: 0xA1887F, dist: 0xD7CCC8, near: 0x6D4C41, details: ['🌋', '🔥', '🪨'], skyDetails: ['🐉', '🚁'], hat: '⛑️' },
        { name: "Blueberry Hill", sky: 0xE8EAF6, pillar: 0x7986CB, dist: 0xC5CAE9, near: 0x3F51B5, details: ['🫐', '🧺', '🥧'], skyDetails: ['🦅', '✈️'], hat: '👒' },
        { name: "Matcha Tea", sky: 0xF9FBE7, pillar: 0xDCE775, dist: 0xF0F4C3, near: 0xAFB42B, details: ['🍵', '🍘', '🎎'], skyDetails: ['🦅'], hat: '👒' },
        { name: "Candy Cloud", sky: 0xFFF0F5, pillar: 0xFFB6C1, dist: 0xFFC0CB, near: 0xFF69B4, details: ['🍭', '🍬', '🍦'], skyDetails: ['🦄', '✈️'], hat: '🎀' },
        { name: "Silver Moon", sky: 0xFAFAFA, pillar: 0xBDBDBD, dist: 0xEEEEEE, near: 0x757575, details: ['🌙', '🐺', '☁️'], skyDetails: ['🐉'], hat: '👨‍🚀' },
        { name: "Peachy Sunset", sky: 0xFFE0B2, pillar: 0xFFAB91, dist: 0xFFCCBC, near: 0xE64A19, details: ['🍑', '🍹', '🌴'], skyDetails: ['🦅', '✈️'], hat: '👒' },
        { name: "Arctic Blue", sky: 0xB3E5FC, pillar: 0x29B6F6, dist: 0x81D4FA, near: 0x0288D1, details: ['🧊', '🐧', '🎿'], skyDetails: ['🦅', '🚁'], hat: '🧶' },
        { name: "Cosmic Glow", sky: 0x4A148C, pillar: 0xAB47BC, dist: 0x7B1FA2, near: 0x6A1B9A, details: ['🛸', '👽', '👾'], skyDetails: ['🐉', '🛸', '🚀'], hat: '👨‍🚀' }
    ];

    constructor ()
    {
        super('Game');
    }

    init(data: { vehicleIndex?: number, isTourMode?: boolean }) {
        if (data && data.vehicleIndex !== undefined) {
            this.currentVehicleIndex = data.vehicleIndex;
        }
        this.isTourMode = data?.isTourMode || false;
        this.score = 0;
        this.level = 1;
        this.isGameOver = false;
        this.isPaused = false;
        this.isTransitioning = false;
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;

        // Background layers (Depths 0-10)
        this.skyBg = this.add.rectangle(width/2, height/2, width, height, this.levelData[0].sky).setDepth(0);
        this.clouds = this.add.group();
        this.hillsDist = this.add.group();
        this.hillsNear = this.add.group();
        this.detailAssets = this.add.group();
        this.skyAssets = this.add.group();

        this.createScenery();

        // Character Components
        this.playerEmoji = this.add.text(0, -20, '🧔', { fontSize: '64px' }).setOrigin(0.5);
        this.hatEmoji = this.add.text(0, -55, this.levelData[0].hat, { fontSize: '40px' }).setOrigin(0.5);
        this.companionEmoji = this.add.text(-45, -30, '🐦', { fontSize: '32px' }).setOrigin(0.5);
        
        const vEmoji = this.actualVehicles[this.currentVehicleIndex];
        this.vehicleEmoji = this.add.text(0, 20, vEmoji, { fontSize: '56px' }).setOrigin(0.5);
        
        this.applyVehicleStyle(vEmoji);
        
        this.player = this.add.container(200, height / 2, [this.vehicleEmoji, this.playerEmoji, this.hatEmoji, this.companionEmoji]);
        this.player.setSize(40, 40); 
        this.player.setDepth(50);
        
        this.physics.add.existing(this.player);
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setGravityY(900);
        body.setCollideWorldBounds(true);

        if (this.isTourMode) {
            this.player.setAlpha(0.6);
            this.tourText = this.add.text(width / 2, height - 40, 'WORLD TOUR MODE: INVINCIBLE', {
                fontFamily: 'Arial', fontSize: '18px', color: '#FFF176',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5).setDepth(200);
        }

        // Pillars (Depth 100)
        this.pillars = this.physics.add.group();

        // UI (Depth 200)
        this.scoreText = this.add.text(width / 2, 50, 'Score: 0', {
            fontFamily: 'Arial Black', fontSize: '32px', color: '#ffffff',
            stroke: '#455A64', strokeThickness: 4
        }).setOrigin(0.5).setDepth(200);

        this.levelText = this.add.text(width / 2, 90, 'Level 1: Jungle Village', {
            fontFamily: 'Arial Black', fontSize: '20px', color: '#ffffff',
            stroke: '#455A64', strokeThickness: 2
        }).setOrigin(0.5).setDepth(200);

        this.pauseButton = this.add.text(width - 50, 50, '⏸️', { fontSize: '32px' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(200);

        this.pauseButton.on('pointerdown', () => this.togglePause());

        this.pauseText = this.add.text(width / 2, height / 2, 'PAUSED', {
            fontFamily: 'Arial Black', fontSize: '64px', color: '#ffffff',
            stroke: '#455A64', strokeThickness: 10
        }).setOrigin(0.5).setDepth(201).setVisible(false);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.x > width - 100 && pointer.y < 100) return;
            this.flap();
        });

        if (this.input.keyboard) {
            this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
                if (event.key === 'p' || event.key === 'P') {
                    this.togglePause();
                } else if (event.key === 't' || event.key === 'T') {
                    this.toggleTourMode();
                } else if (event.code === 'Space') {
                    this.flap();
                }
            });
        }

        this.spawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnPillar,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.player, this.pillars, this.hitPillar, undefined, this);
        this.createParticles();

        EventBus.emit('current-scene-ready', this);
    }

    applyVehicleStyle(emoji: string) {
        if (emoji === '🛺' || emoji === '⛵' || emoji === '🛵') {
            this.vehicleEmoji.setX(35);
            this.vehicleEmoji.setScale(-1, 1); // Flip to face Right
        } else {
            this.vehicleEmoji.setX(0);
            this.vehicleEmoji.setScale(1, 1);
        }
    }

    toggleTourMode() {
        this.isTourMode = !this.isTourMode;
        this.player.setAlpha(this.isTourMode ? 0.6 : 1.0);
        
        if (this.isTourMode) {
            if (!this.tourText) {
                this.tourText = this.add.text(this.scale.width / 2, this.scale.height - 40, 'WORLD TOUR MODE: INVINCIBLE', {
                    fontFamily: 'Arial', fontSize: '18px', color: '#FFF176',
                    stroke: '#000', strokeThickness: 3
                }).setOrigin(0.5).setDepth(200);
            }
            this.tourText.setVisible(true);
        } else if (this.tourText) {
            this.tourText.setVisible(false);
        }
    }

    togglePause() {
        if (this.isGameOver || this.isTransitioning) return;
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.physics.pause();
            this.spawnTimer.paused = true;
            this.pauseText.setVisible(true);
            this.pauseButton.setText('▶️');
        } else {
            this.physics.resume();
            this.spawnTimer.paused = false;
            this.pauseText.setVisible(false);
            this.pauseButton.setText('⏸️');
        }
    }

    createScenery() {
        const width = this.scale.width;
        const height = this.scale.height;
        const data = this.levelData[Math.min(this.level - 1, 19)];

        for (let i = 0; i < 3; i++) {
            const hill = this.add.circle(i * 500, height - 100, 400, data.dist).setAlpha(0.8).setDepth(1);
            this.hillsDist.add(hill);
        }

        if (data.skyDetails && data.skyDetails.length > 0) {
            for (let i = 0; i < 3; i++) {
                const asset = Phaser.Utils.Array.GetRandom(data.skyDetails);
                const x = Phaser.Math.Between(0, width * 2);
                const y = Phaser.Math.Between(100, 400);
                const skyAsset = this.add.text(x, y, asset, { fontSize: '42px' }).setOrigin(0.5).setAlpha(0.2).setDepth(2);
                this.skyAssets.add(skyAsset);
            }
        }

        for (let i = 0; i < 6; i++) {
            const asset = Phaser.Utils.Array.GetRandom(data.details);
            const x = Phaser.Math.Between(0, width * 2);
            const detail = this.add.text(x, height - 100, asset, { fontSize: '48px' }).setOrigin(0.5, 1).setAlpha(0.35).setDepth(3);
            this.detailAssets.add(detail);
        }

        for (let i = 0; i < 4; i++) {
            const hill = this.add.circle(i * 300, height - 50, 250, data.near).setAlpha(0.9).setDepth(4);
            this.hillsNear.add(hill);
        }

        for (let i = 0; i < 5; i++) {
            const cloud = this.add.text(Phaser.Math.Between(0, width), Phaser.Math.Between(50, 300), '☁️', { fontSize: '64px' }).setAlpha(0.5).setDepth(5);
            this.clouds.add(cloud);
        }
    }

    updateScenery(delta: number) {
        if (this.isGameOver || this.isPaused) return;

        this.hillsDist.children.iterate((child: any) => {
            child.x -= 0.5;
            if (child.x < -400) child.x = this.scale.width + 400;
            return true;
        });

        this.skyAssets.children.iterate((child: any) => {
            child.x -= 2.0;
            if (child.x < -100) child.x = this.scale.width + 100;
            return true;
        });

        this.detailAssets.children.iterate((child: any) => {
            child.x -= 1.0;
            if (child.x < -100) child.x = this.scale.width + 100;
            return true;
        });

        this.hillsNear.children.iterate((child: any) => {
            child.x -= 1.5;
            if (child.x < -250) child.x = this.scale.width + 250;
            return true;
        });

        this.clouds.children.iterate((child: any) => {
            child.x -= 0.2;
            if (child.x < -100) child.x = this.scale.width + 100;
            return true;
        });
    }

    createParticles() {
        const particles = this.add.particles(0, 0, 'star', {
            x: { min: 0, max: 1024 },
            y: -10, lifespan: 5000, speedY: { min: 50, max: 150 }, scale: { start: 0.2, end: 0 }, alpha: { start: 0.6, end: 0 },
            frequency: 100, blendMode: 'ADD'
        });
        particles.setDepth(1);
    }

    flap() {
        if (this.isGameOver || this.isPaused) return;
        (this.player.body as Phaser.Physics.Arcade.Body).setVelocityY(-380);
        
        // Mamu tilt
        this.tweens.add({ targets: this.player, angle: -15, duration: 100, yoyo: true });
        
        // Companion reaction (Bird flutter)
        this.tweens.add({
            targets: this.companionEmoji,
            y: -45,
            scale: 1.3,
            duration: 150,
            yoyo: true,
            ease: 'Back.easeOut'
        });
    }

    spawnPillar() {
        if (this.isGameOver || this.isPaused || this.isTransitioning) return;

        const width = this.scale.width;
        const height = this.scale.height;
        const gap = 280;
        const minPillarHeight = 100;
        const randomHeight = Phaser.Math.Between(minPillarHeight, height - gap - minPillarHeight);
        const data = this.levelData[Math.min(this.level - 1, 19)];

        const topPillar = this.add.rectangle(width + 50, randomHeight / 2, 80, randomHeight, data.pillar).setStrokeStyle(4, 0xffffff, 0.5).setDepth(100);
        this.pillars.add(topPillar);
        (topPillar.body as Phaser.Physics.Arcade.Body).setVelocityX(-200);
        (topPillar.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        const bottomHeight = height - randomHeight - gap;
        const bottomPillar = this.add.rectangle(width + 50, height - bottomHeight / 2, 80, bottomHeight, data.pillar).setStrokeStyle(4, 0xffffff, 0.5).setDepth(100);
        this.pillars.add(bottomPillar);
        (bottomPillar.body as Phaser.Physics.Arcade.Body).setVelocityX(-200);
        (bottomPillar.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        this.time.delayedCall(6000, () => {
            topPillar.destroy();
            bottomPillar.destroy();
            if (!this.isGameOver) {
                this.score++;
                this.scoreText.setText(`Score: ${this.score}`);
                this.checkLevelTransition();
            }
        });
    }

    checkLevelTransition() {
        if (this.score % 10 === 0 && this.score > 0) {
            const nextLevel = (this.score / 10) + 1;
            if (nextLevel <= 20) {
                this.performTransition(nextLevel);
            }
        }
    }

    performTransition(newLevel: number) {
        this.isTransitioning = true;
        this.level = newLevel;
        const data = this.levelData[Math.min(this.level - 1, 19)];
        this.levelText.setText(`Level ${this.level}: ${data.name}`);
        
        this.cameras.main.fadeOut(300, 255, 255, 255);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.skyBg.setFillStyle(data.sky);
            this.hillsDist.clear(true, true);
            this.hillsNear.clear(true, true);
            this.detailAssets.clear(true, true);
            this.skyAssets.clear(true, true);
            this.createScenery();
            
            // Update Hat
            this.hatEmoji.setText(data.hat);
            
            // Re-apply offsets & flips for updated vehicle
            let vEmoji = this.actualVehicles[this.currentVehicleIndex];
            if (this.actualVehicles[this.currentVehicleIndex] === '🛹') {
                 if (this.level % 2 === 0) vEmoji = '🛸';
                 else vEmoji = '🛹';
            }
            this.vehicleEmoji.setText(vEmoji);
            this.applyVehicleStyle(vEmoji);
            
            this.cameras.main.fadeIn(300, 255, 255, 255);
            this.time.delayedCall(100, () => { this.isTransitioning = false; });
        });
    }

    hitPillar() {
        if (this.isTransitioning || this.isTourMode) return; 
        
        this.isGameOver = true;
        this.physics.pause();
        this.spawnTimer.remove();
        this.playerEmoji.setText('😵');
        this.cameras.main.shake(500, 0.02);
        this.time.delayedCall(1000, () => { this.scene.start('GameOver'); });
    }

    update(time: number, delta: number) {
        if (this.isGameOver || this.isPaused || !this.player || !this.player.body) return;
        this.updateScenery(delta);
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        if (body.velocity.y > 0) { this.player.angle = Math.min(this.player.angle + 2, 30); }
    }
}

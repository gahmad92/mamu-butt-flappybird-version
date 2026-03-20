import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    player: Phaser.GameObjects.Container;
    playerEmoji: Phaser.GameObjects.Text;
    vehicleEmoji: Phaser.GameObjects.Text;
    
    // Parallax Backgrounds
    skyBg: Phaser.GameObjects.Rectangle;
    clouds: Phaser.GameObjects.Group;
    hillsDist: Phaser.GameObjects.Group;
    hillsNear: Phaser.GameObjects.Group;
    
    pillars: Phaser.Physics.Arcade.Group;
    
    score: number = 0;
    scoreText: Phaser.GameObjects.Text;
    
    level: number = 1;
    levelText: Phaser.GameObjects.Text;
    
    spawnTimer: Phaser.Time.TimerEvent;
    
    isGameOver: boolean = false;
    isPaused: boolean = false;
    isTransitioning: boolean = false;
    pauseText: Phaser.GameObjects.Text;
    pauseButton: Phaser.GameObjects.Text;
    
    // Vehicle Options
    vehicles = ['🛹', '🛺', '🛸', '⛵', '🛵', '🛋️'];
    currentVehicleIndex = 0;
    
    // Ghibli Colors
    level1Colors = {
        sky: 0x81D4FA,
        pillar: 0xA5D6A7,
        hillsDist: 0xC8E6C9,
        hillsNear: 0x81C784,
        accent: 0xFFAB91
    };
    
    level2Colors = {
        sky: 0xE1F5FE,
        pillar: 0xB3E5FC,
        hillsDist: 0xE1F5FE,
        hillsNear: 0x90CAF9,
        accent: 0xFFFFFF
    };

    constructor ()
    {
        super('Game');
    }

    init(data: { vehicleIndex?: number }) {
        if (data && data.vehicleIndex !== undefined) {
            this.currentVehicleIndex = data.vehicleIndex;
        }
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

        // Background layers
        this.skyBg = this.add.rectangle(width/2, height/2, width, height, this.level1Colors.sky);
        this.clouds = this.add.group();
        this.hillsDist = this.add.group();
        this.hillsNear = this.add.group();

        this.createScenery();

        // Character: Mamu Butt on a Vehicle
        this.playerEmoji = this.add.text(0, -20, '🧔', { fontSize: '64px' }).setOrigin(0.5);
        this.vehicleEmoji = this.add.text(0, 20, this.vehicles[this.currentVehicleIndex], { fontSize: '56px' }).setOrigin(0.5);
        
        this.player = this.add.container(200, height / 2, [this.vehicleEmoji, this.playerEmoji]);
        this.player.setSize(40, 40); // Smaller hitbox for "easy" gameplay
        
        this.physics.add.existing(this.player);
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setGravityY(900);
        body.setCollideWorldBounds(true);

        // Hurdles
        this.pillars = this.physics.add.group();

        // UI
        this.scoreText = this.add.text(width / 2, 50, 'Score: 0', {
            fontFamily: 'Arial Black', fontSize: '32px', color: '#ffffff',
            stroke: '#455A64', strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);

        this.levelText = this.add.text(width / 2, 90, 'Level: Jungle & Village', {
            fontFamily: 'Arial Black', fontSize: '20px', color: '#ffffff',
            stroke: '#455A64', strokeThickness: 2
        }).setOrigin(0.5).setDepth(100);

        // Pause Button
        this.pauseButton = this.add.text(width - 50, 50, '⏸️', { fontSize: '32px' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(101);

        this.pauseButton.on('pointerdown', () => this.togglePause());

        this.pauseText = this.add.text(width / 2, height / 2, 'PAUSED', {
            fontFamily: 'Arial Black', fontSize: '64px', color: '#ffffff',
            stroke: '#455A64', strokeThickness: 10
        }).setOrigin(0.5).setDepth(101).setVisible(false);

        // Input
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.x > width - 100 && pointer.y < 100) return;
            this.flap();
        });

        if (this.input.keyboard) {
            this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
                if (event.key === 'p' || event.key === 'P') {
                    this.togglePause();
                } else if (event.code === 'Space') {
                    this.flap();
                }
            });
        }

        // Spawn pillars every 2 seconds
        this.spawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnPillar,
            callbackScope: this,
            loop: true
        });

        // Collisions
        this.physics.add.overlap(this.player, this.pillars, this.hitPillar, undefined, this);

        // Particles for Ghibli feel
        this.createParticles();

        EventBus.emit('current-scene-ready', this);
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

        for (let i = 0; i < 3; i++) {
            const hill = this.add.circle(i * 500, height - 100, 400, this.level1Colors.hillsDist).setAlpha(0.8);
            this.hillsDist.add(hill);
        }

        for (let i = 0; i < 4; i++) {
            const hill = this.add.circle(i * 300, height - 50, 250, this.level1Colors.hillsNear).setAlpha(0.9);
            this.hillsNear.add(hill);
        }

        for (let i = 0; i < 5; i++) {
            const cloud = this.add.text(Phaser.Math.Between(0, width), Phaser.Math.Between(50, 300), '☁️', { fontSize: '64px' }).setAlpha(0.5);
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
            y: -10,
            lifespan: 5000,
            speedY: { min: 50, max: 150 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.6, end: 0 },
            rotate: { min: 0, max: 360 },
            frequency: 100,
            blendMode: 'ADD'
        });
        particles.setDepth(1);
    }

    flap() {
        if (this.isGameOver || this.isPaused || this.isTransitioning) return;
        
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setVelocityY(-350);
        
        this.tweens.add({
            targets: this.player,
            angle: -15,
            duration: 100,
            yoyo: true
        });
    }

    spawnPillar() {
        if (this.isGameOver || this.isPaused || this.isTransitioning) return;

        const width = this.scale.width;
        const height = this.scale.height;
        const gap = 280;
        const minPillarHeight = 100;
        const randomHeight = Phaser.Math.Between(minPillarHeight, height - gap - minPillarHeight);

        const color = this.level === 1 ? this.level1Colors.pillar : this.level2Colors.pillar;

        const topPillar = this.add.rectangle(width + 50, randomHeight / 2, 80, randomHeight, color).setStrokeStyle(4, 0xffffff, 0.5);
        this.pillars.add(topPillar);
        (topPillar.body as Phaser.Physics.Arcade.Body).setVelocityX(-200);
        (topPillar.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        const bottomHeight = height - randomHeight - gap;
        const bottomPillar = this.add.rectangle(width + 50, height - bottomHeight / 2, 80, bottomHeight, color).setStrokeStyle(4, 0xffffff, 0.5);
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
        if (this.score === 10 && this.level === 1) {
            this.isTransitioning = true;
            this.level = 2;
            this.levelText.setText('Level: Snowy Mountains');
            
            // Start Fade Out
            this.cameras.main.fadeOut(500, 255, 255, 255);
            
            this.cameras.main.once('camerafadeoutcomplete', () => {
                // Change visuals
                this.skyBg.setFillStyle(this.level2Colors.sky);
                this.hillsDist.children.iterate((child: any) => { (child as Phaser.GameObjects.Shape).setFillStyle(this.level2Colors.hillsDist); return true; });
                this.hillsNear.children.iterate((child: any) => { (child as Phaser.GameObjects.Shape).setFillStyle(this.level2Colors.hillsNear); return true; });
                
                if (this.vehicles[this.currentVehicleIndex] === '🛹') {
                    this.vehicleEmoji.setText('🛸');
                }
                
                // Fade Back In
                this.cameras.main.fadeIn(500, 255, 255, 255);
                this.isTransitioning = false;
            });
        }
    }

    hitPillar() {
        if (this.isTransitioning) return; // Invincible during level change
        
        this.isGameOver = true;
        this.physics.pause();
        this.spawnTimer.remove();
        
        this.playerEmoji.setText('😵');
        this.cameras.main.shake(500, 0.02);
        
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOver');
        });
    }

    update(time: number, delta: number) {
        if (this.isGameOver || this.isPaused || !this.player || !this.player.body) return;
        
        this.updateScenery(delta);

        const body = this.player.body as Phaser.Physics.Arcade.Body;
        if (body.velocity.y > 0) {
            this.player.angle = Math.min(this.player.angle + 2, 30);
        }
    }
}

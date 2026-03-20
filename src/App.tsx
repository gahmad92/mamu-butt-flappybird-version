import { useRef, useState, useCallback } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';

function App()
{
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [currentSceneName, setCurrentSceneName] = useState('Booting...');

    const changeScene = () => {
        if(phaserRef.current)
        {     
            const scene = phaserRef.current.scene;
            if (scene)
            {
                const sceneKey = scene.scene.key;
                console.log('Current Scene Key:', sceneKey);
                
                if (sceneKey === 'MainMenu') {
                    scene.scene.start('Game');
                } else if (sceneKey === 'GameOver') {
                    scene.scene.start('MainMenu');
                }
            }
            else {
                console.warn('Phaser Scene is not yet ready in the ref.');
            }
        }
    }

    const restartGame = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene;
            if (scene) {
                scene.scene.start('Game');
            }
        }
    }

    const currentScene = useCallback((scene: Phaser.Scene) => {
        setCurrentSceneName(scene.scene.key);
    }, []);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div className="ui-controls">
                {currentSceneName === 'MainMenu' && (
                    <button className="button" onClick={changeScene}>Start Adventure</button>
                )}
                {currentSceneName === 'Game' && (
                    <div className="spritePosition">
                        Level: Jungle/Village | Tip: Use <b>Space</b> or <b>Click</b>!
                    </div>
                )}
                {currentSceneName === 'GameOver' && (
                    <button className="button" onClick={restartGame}>Try Again</button>
                )}
                {currentSceneName === 'Booting...' && (
                    <div className="spritePosition">Loading Ghibli World...</div>
                )}
            </div>
        </div>
    )
}

export default App;

import useSound from 'use-sound';

// Using free sound assets hosted on a reliable CDN or public repo for the demo.
// Ideally these should be local files in /public/sounds/

const SOUNDS = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Pop/Click
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Gentle success
    delete: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Crumple/Delete like sound
    switch: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Switch click
};

export const useAppSounds = () => {
    const [playClick] = useSound(SOUNDS.click, { volume: 0.5 });
    const [playSuccess] = useSound(SOUNDS.success, { volume: 0.5 });
    const [playDelete] = useSound(SOUNDS.delete, { volume: 0.4 });
    const [playSwitch] = useSound(SOUNDS.switch, { volume: 0.5 });

    return {
        playClick,
        playSuccess,
        playDelete, // For "simulation" toggle off
        playSwitch, // For dark mode or on
    };
};

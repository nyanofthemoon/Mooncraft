let audio = {
    music: [],
    sound: []
};

export function setAudioAssets(musics, sounds) {
    audio.music = musics;
    audio.sound = sounds;
}

export function playSound(id) {
    audio.sound.forEach(function(sound) {
        if (id === sound.id) {
            sound.track.play();
            return;
        }
    });
}

export function playMusic(id) {
    audio.music.forEach(function(music) {
        music.track.stop();
        if (id === music.id) {
            music.track.play();
        }
    });
}
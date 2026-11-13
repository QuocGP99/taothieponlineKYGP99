'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
  initialPlay?: boolean;
}

export default function MusicPlayer({ initialPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Soft ambient piano/chime notes synthesis for youth emotion
  const playYouthMelody = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Pentatonic dreamy scale notes (Hz)
      const notes = [
        261.63, // C4
        293.66, // D4
        329.63, // E4
        392.00, // G4
        440.00, // A4
        523.25, // C5
        587.33, // D5
        659.25  // E5
      ];

      let noteIndex = 0;
      const melodySequence = [0, 2, 4, 3, 2, 0, 4, 5, 4, 2, 1, 0];

      const playNote = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = notes[melodySequence[noteIndex % melodySequence.length]];
        noteIndex++;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft attack and decay envelope
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.9);

        timerRef.current = setTimeout(playNote, 1400);
      };

      playNote();
    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
  };

  const stopMusic = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
      setIsPlaying(false);
    } else {
      playYouthMelody();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        onClick={toggleMusic}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-lg backdrop-blur border text-xs font-bold transition-all ${
          isPlaying
            ? 'bg-purple-900/90 text-purple-200 border-purple-500 shadow-purple-500/30'
            : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'
        }`}
      >
        {isPlaying ? (
          <>
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-1 bg-pink-400 h-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-purple-400 h-2 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-pink-400 h-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <Volume2 className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">Nhạc thanh xuân: Đang bật</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-gray-400" />
            <span className="hidden sm:inline">Bật nhạc nền</span>
          </>
        )}
      </button>
    </div>
  );
}

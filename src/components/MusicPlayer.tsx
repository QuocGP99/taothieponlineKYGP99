'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const YOUTH_SONGS: Record<string, { title: string; desc: string; bpm: number }> = {
  'dong-bang': {
    title: 'Mình Cùng Nhau Đóng Băng',
    desc: 'Giai điệu thanh xuân bất hủ',
    bpm: 110
  },
  'nu-cuoi-18-20': {
    title: 'Nụ Cười 18 20',
    desc: 'Tươi vui, rạng rỡ tuổi thanh xuân',
    bpm: 125
  },
  'tam-biet-nhe': {
    title: 'Tạm Biệt Nhé',
    desc: 'Kỷ niệm chia tay tuổi học trò',
    bpm: 95
  },
  'piano-chill': {
    title: 'Piano Hoài Niệm',
    desc: 'Giai điệu nhẹ nhàng, sâu lắng',
    bpm: 85
  }
};

interface MusicPlayerProps {
  musicTrack?: string;
  initialPlay?: boolean;
}

export default function MusicPlayer({ musicTrack = 'dong-bang', initialPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<any>(null);

  if (musicTrack === 'none') {
    return null;
  }

  const currentSong = YOUTH_SONGS[musicTrack] || YOUTH_SONGS['dong-bang'];

  // Bộ phát giai điệu thanh xuân tương tác bằng Web Audio Synthesis (tự động chạy không phụ thuộc file ngoài)
  const playMelody = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Chuỗi nốt thanh xuân tương ứng với từng bài hát
      const songScales: Record<string, number[]> = {
        'dong-bang': [261.63, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63],
        'nu-cuoi-18-20': [293.66, 369.99, 440.00, 587.33, 440.00, 369.99, 440.00, 587.33],
        'tam-biet-nhe': [261.63, 293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66],
        'piano-chill': [220.00, 261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 261.63]
      };

      const notes = songScales[musicTrack] || songScales['dong-bang'];
      let noteIndex = 0;

      const playNextNote = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = notes[noteIndex % notes.length];
        noteIndex++;

        osc.type = musicTrack === 'nu-cuoi-18-20' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Âm lượng nhẹ nhàng êm dịu
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.7);

        const interval = Math.max(700, Math.round(60000 / (currentSong.bpm || 100)));
        timerRef.current = setTimeout(playNextNote, interval);
      };

      playNextNote();
    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
  };

  const stopMelody = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMelody();
      setIsPlaying(false);
    } else {
      playMelody();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopMelody();
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        type="button"
        onClick={toggleMusic}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg backdrop-blur-md border text-xs font-bold transition-all cursor-pointer ${
          isPlaying
            ? 'bg-[#890F0D] text-white border-[#890F0D]/40 shadow-[#890F0D]/30 scale-105'
            : 'bg-white/95 text-stone-700 border-stone-200 hover:bg-[#FFF8F8] hover:text-[#890F0D]'
        }`}
        title={isPlaying ? 'Bấm để tắt nhạc' : `Bấm để bật nhạc: ${currentSong.title}`}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-1 bg-amber-300 h-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-amber-200 h-2 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-amber-300 h-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[11px] font-bold max-w-[140px] truncate">{currentSong.title}</span>
          </>
        ) : (
          <>
            <Music className="w-3.5 h-3.5 text-[#890F0D]" />
            <span className="text-[11px]">Bật nhạc nền</span>
          </>
        )}
      </button>
    </div>
  );
}

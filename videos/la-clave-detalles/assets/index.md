# Assets

| file | what | source |
| --- | --- | --- |
| img/golden-key.webp | Ornate antique golden key, transparent background (1985×581) | Magnific — Seedream 5 Pro, 2K; background removed with Magnific. Cropped, alpha ≥250 → 255, WebP q95. |
| img/golden-key-shadow.webp | Soft drop shadow | Derived locally from the key's alpha (Gaussian blur 26 px, 92%). |
| img/paper.webp | Cotton paper tooth (1440×2560) | Magnific — Seedream 5 Pro, 2K. High-passed (σ 40 px), despeckled, normalised to a 2-level luma std on #f2efe9. |
| audio/sound.wav | Final mix, −14.6 LUFS / −1.1 dBTP | audio/build_audio.py → procedural-sfx mix.py (music ducked 3.5 dB under hero sounds) → master.sh |
| ../audio/src/music.wav | Underscore, first 6.6 s, faded out from 5.95 s | Magnific — Google Lyria 3 ("elegant minimal luxury underscore, felt piano, upright bass, light percussion, 96 BPM") |
| ../audio/src/swish.wav | Key thrown past the mic | Magnific — ElevenLabs SFX |
| ../audio/src/clink.wav, slide.wav | Key hitting paper on a desk; the paper slide moved to right after the impact | Magnific — ElevenLabs SFX (two takes, trimmed) |
| ../audio/src/swell.wav, air.wav | Transition swell and airy swish | Magnific — ElevenLabs SFX |
| ../audio/src/tink.wav | Light metal tink | Magnific — ElevenLabs SFX (trimmed) |
| fonts/InterDisplay-SemiBold.otf | Typeface | Inter Display (SIL OFL 1.1), see fonts/LICENSE-Inter.txt |
| vendor/gsap.min.js | GSAP 3.14.2 | npm |

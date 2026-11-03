import sys, json, mlx_whisper
for v in sys.argv[2:]:
    r = mlx_whisper.transcribe(f"{sys.argv[1]}/{v}.wav", path_or_hf_repo="mlx-community/whisper-large-v3-turbo",
        language="es", word_timestamps=True,
        initial_prompt="Kunfupay, hub, Dubái, Miami, Bali, LATAM, fiscalidad, LLC, residencia fiscal, nómadas digitales.")
    json.dump(r, open(f"{sys.argv[1]}/{v}.json","w"), ensure_ascii=False, indent=1)
    print("==", v); [print(f"{s['start']:6.2f}-{s['end']:6.2f} {s['text']}") for s in r["segments"]]

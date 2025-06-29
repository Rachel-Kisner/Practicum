import io

import numpy as np

if not hasattr(np, 'complex'):
    np.complex = complex
from flask import Flask, request, send_file, jsonify
import os
import librosa
import soundfile as sf
import uuid

app = Flask(__name__)


@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    input_buffer = io.BytesIO(file.read())
    output_filename = f"ringtone_{uuid.uuid4().hex}.wav"

    try:
        y, sr = librosa.load(input_buffer, sr=None)
        y = y.T[0] if y.ndim > 1 else y
        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
        beat_times = librosa.frames_to_time(beat_frames, sr=sr)
        if len(beat_times) == 0:
            return jsonify({"error": "No beats detected"}), 422
        peak_time = float(beat_times[len(beat_times) // 2])
        ringtone_duration = 20.0
        start_sample = int(peak_time * sr)
        end_sample = int((peak_time + ringtone_duration) * sr)
        ringtone = y[start_sample:end_sample]
        if len(ringtone) < int(ringtone_duration * sr):
            padding = int(ringtone_duration * sr) - len(ringtone)
            ringtone = librosa.util.fix_length(ringtone, len(ringtone) + padding)
        ringtone_buffer = io.BytesIO()
        sf.write(ringtone_buffer, ringtone, sr, format='WAV')
        ringtone_buffer.seek(0)

        return send_file(ringtone_buffer, mimetype="audio/wav", as_attachment=True, download_name="ringtone.wav")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

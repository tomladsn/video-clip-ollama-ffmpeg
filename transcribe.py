import whisper

# Load the base model
model = whisper.load_model("base")

# Transcribe audio
result = model.transcribe("clip_clip_1.mp4")

# Function to format time in SRT style (hours:minutes:seconds,milliseconds)
def format_timestamp(seconds):
    milliseconds = int((seconds % 1) * 1000)
    seconds = int(seconds)
    minutes = seconds // 60
    hours = minutes // 60
    seconds = seconds % 60
    minutes = minutes % 60
    return f"{hours:02}:{minutes:02}:{seconds:02},{milliseconds:03}"

# Write the transcription result to an SRT file
with open("transcription.srt", "w", encoding="utf-8") as srt_file:
    for i, segment in enumerate(result['segments']):
        # Write the index of the subtitle
        srt_file.write(f"{i+1}\n")
        
        # Write the start and end time in SRT format
        start_time = format_timestamp(segment['start'])
        end_time = format_timestamp(segment['end'])
        srt_file.write(f"{start_time} --> {end_time}\n")
        
        # Write the transcription text
        srt_file.write(f"{segment['text'].strip()}\n\n")

print("Transcription saved to transcription.srt")

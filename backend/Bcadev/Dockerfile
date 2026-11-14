FROM python:3.12-slim
WORKDIR /app
# ffprobe mesure les vocaux WebM enregistrés dans le navigateur.
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev gcc ffmpeg && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

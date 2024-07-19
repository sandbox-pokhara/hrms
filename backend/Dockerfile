FROM python:3.11-alpine
# curl is used for healthchecks
RUN apk --no-cache add curl
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY manage.py .
COPY project project
RUN python manage.py collectstatic --noinput
EXPOSE 8000
CMD ["/bin/sh", "-c", "python manage.py migrate;gunicorn --bind 0.0.0.0:8000 --workers=1 --env DJANGO_SETTINGS_MODULE=project.settings project.wsgi"]

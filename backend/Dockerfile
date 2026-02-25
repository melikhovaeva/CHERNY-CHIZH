FROM python:3.14-alpine

WORKDIR /backend-app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

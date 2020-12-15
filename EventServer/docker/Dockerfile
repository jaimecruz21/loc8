FROM python:3.9-slim

ENV PYTHONUNBUFFERED 1
ENV C_FORCE_ROOT true

RUN mkdir -p /opt
WORKDIR /opt
COPY requirements.txt  /opt/
RUN pip install -r requirements.txt
COPY . /opt/
ENTRYPOINT ./entrypoint.sh
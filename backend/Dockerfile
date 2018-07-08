FROM python:slim

WORKDIR /backend

COPY requirements.txt .

RUN pip install -r requirements.txt

CMD flask run --host=0.0.0.0

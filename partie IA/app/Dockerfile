FROM python:3.9
RUN pip install --upgrade pip
RUN pip install --upgrade typing-extensions
RUN pip install pika pandas statsmodels
EXPOSE 6000
COPY . /app
CMD ["python", "/app/modelP.py"]
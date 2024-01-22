import json
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import pika
from matplotlib import pyplot

EXCHANGE_NAME = 'prediction_exchangesa'
QUEUE_NAME = 'arima-result-queue'

# Train ARIMA model

def train_and_predict_arima(start_date, csv_path):
    # Convert the list of dictionaries to a DataFrame
    df = pd.DataFrame(csv_path)

    # Convert the 'date' column to datetime format
    df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d')

    # Set 'date' as the index
    df.set_index('date', inplace=True)

    # ... rest of the code remains unchanged ...

    # Fit ARIMA model
    order = (1, 1, 1)  # You may need to tune these parameters based on your data
    model = ARIMA(df['temperature'], order=order,seasonal_order=(5, 1, 1, 12), enforce_stationarity=False, enforce_invertibility=False)
    result = model.fit()

    # Forecast future temperatures
    future_date = pd.to_datetime(start_date, format='%Y-%m-%d')
    print(f"future_date------: {future_date}")
    forecast_steps = (future_date - df.index[-1]).days
    print(f"forecast_steps----- {forecast_steps}")
    forecast = result.get_forecast(steps=forecast_steps)

    # Explicitly set the index of the forecast results
    forecast_dates = pd.date_range(start=df.index[-1], periods=forecast_steps + 1, freq='D')[1:]
    forecast_values = forecast.predicted_mean
    forecast_values.index = forecast_dates

    # Print the available forecast dates
    print("Available forecast dates:")
    print(forecast_dates)

    # Find the nearest date in the forecasted values to future_date
    nearest_date = min(forecast_dates, key=lambda x: abs(x - future_date))

    # Print the nearest date
    print("Nearest forecast date:", nearest_date)
    print(f"forecast_values------: {forecast_values}")

    # Return ARIMA predictions (replace with your actual result)
    future_value = forecast_values.loc[nearest_date]
    print(f"future_value------: {future_value}")
    print(f'The forecasted temperature for {future_date.date()} is {future_value:.2f} degrees Celsius.')

    return forecast_values

####
def train_arima(df_train):
    # Adjust order as needed
    order = (1, 1, 1)
    model = ARIMA(df_train['temperature'], order=order,seasonal_order=(5, 1, 1, 12), enforce_stationarity=False, enforce_invertibility=False)
    model_fit = model.fit()
    return model_fit
# Forecast using the trained ARIMA model
def forecast_arima(model, df_forecast):
    forecast_steps = len(df_forecast)
    forecast_values = model.predict(start=df_forecast.index[0], end=df_forecast.index[-1], dynamic=False)
    return forecast_values

# Callback function for RabbitMQ messages
def callback(ch, method, properties, body):
    message = body.decode('latin-1')
    print(f"Received: {message}")

    try:
        json_object = json.loads(message)
        temperature_data = json_object['temperatureData']
        #########
        start_date = json_object['startDate']
        csv_path = json_object['temperatureData']
        # Perform ARIMA prediction
        prediction = train_and_predict_arima(start_date, csv_path)
        # Publish the prediction back to RabbitMQ
        prediction_dict = [{'date': str(key), 'temperature': value} for key, value in prediction.to_dict().items()]
        print("---hna___")
        print(prediction_dict)
        print("---hna lfok___")

        # Convert the prediction list of dictionaries to a JSON string and publish
        #prediction_message = json.dumps({"prediction": prediction_dict})
        #########
        # Read only the necessary columns
        df1 = pd.read_csv("temperature_da.csv", usecols=['date', 'temperature'], parse_dates=['date'])
        # Set 'date' as the index
        df1.set_index('date', inplace=True)
        # Train ARIMA model
        model_fit = train_arima(df1)

        # Convert the 'date' column to datetime format
        df_forecast = pd.DataFrame(temperature_data)
        df_forecast['date'] = pd.to_datetime(df_forecast['date'], format='%Y-%m-%d')

        # Set 'date' as the index
        df_forecast.set_index('date', inplace=True)

        # Make predictions using the trained model
        forecast_values = forecast_arima(model_fit, df_forecast)

        # Plot forecasts against actual outcomes
        pyplot.plot(df_forecast['temperature'], label='Actual')
        pyplot.plot(forecast_values, color='red', label='Predicted')
        pyplot.legend()
        pyplot.show()

        # Send the forecast values to RabbitMQ
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        channel.exchange_declare(exchange=EXCHANGE_NAME, exchange_type='fanout', durable=True)
        channel.queue_declare(queue=QUEUE_NAME, durable=True)
        channel.queue_bind(exchange=EXCHANGE_NAME, queue=QUEUE_NAME)
        forecast_dict = [{'date': str(key), 'temperature': value} for key, value in forecast_values.items()]
        forecast_dict.extend(prediction_dict)
        print(forecast_dict)
        print("---------")
        prediction_message = json.dumps({"prediction": forecast_dict})
        print(f"Number of elements in forecast_dict: {len(forecast_dict)}")
        channel.basic_publish(exchange=EXCHANGE_NAME, routing_key='', body=prediction_message)
        connection.close()

    except KeyError as e:
        print(f"Error processing message: {e}")

if __name__ == '__main__':
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.exchange_declare(exchange=EXCHANGE_NAME, exchange_type='fanout', durable=True)
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    channel.queue_bind(exchange=EXCHANGE_NAME, queue=QUEUE_NAME)
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback, auto_ack=True)
    print('Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()
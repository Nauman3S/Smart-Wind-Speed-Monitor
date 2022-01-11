import math
from time import time,sleep
import threading


from gpiozero import Button

wind_speed_sensor = Button(5)


radius_cm = 9.0 #radius of anemometer
wind_interval = 5
wind_count = 17
CM_IN_KM=100000.0
SECS_IN_AN_HOUR=3600



def spin():
    global wind_count
    wind_count=wind_count+1
    print('spin')

wind_speed_sensor.when_pressed = spin

def calculate_speed(time_sec):
    global wind_count
    circumference_cm=(2*math.pi)*radius_cm
    rotations=wind_count/2.0

    dist_km=(circumference_cm*rotations)/CM_IN_KM
    km_per_sec=dist_km/time_sec
    km_per_hour=km_per_sec*SECS_IN_AN_HOUR
    # speed=dist_cm/time_sec

    return km_per_hour




def loopWindSpeedSensor(config):
    global wind_count,wind_interval
    while 1:
        wind_count=0
        sleep(wind_interval)
        print(calculate_speed(wind_interval),'km/h')

x = threading.Thread(target=loopWindSpeedSensor, args=(1,))
x.start()

import RPi.GPIO as GPIO # Import Raspberry Pi GPIO library
from time import sleep, time # Import the sleep function from the time module
GPIO.setwarnings(False) # Ignore warning for now
GPIO.setmode(GPIO.BCM) # Use physical pin number
from bmeHandler import *
from ledHandler import *

StatusLED=LED(12,GPIO,GPIO.LOW)

while True:
    print(getBME280Data())
    StatusLED.ON()
    sleep(1)
    StatusLED.OFF()
    sleep(1)
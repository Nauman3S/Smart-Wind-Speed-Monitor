import RPi.GPIO as GPIO # Import Raspberry Pi GPIO library
from time import sleep, time # Import the sleep function from the time module
GPIO.setwarnings(False) # Ignore warning for now
GPIO.setmode(GPIO.BCM) # Use physical pin number
from gpiozero import Buzzer

from bmeHandler import *
from ledHandler import *


StatusLED=LED(12,GPIO,GPIO.LOW)
buzzer = Buzzer(27)


while True:
    print(getBME280Data())
    StatusLED.ON()
    buzzer.on()
    sleep(1)
    StatusLED.OFF()
    buzzer.off()
    sleep(1)
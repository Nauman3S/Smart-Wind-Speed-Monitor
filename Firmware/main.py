import RPi.GPIO as GPIO # Import Raspberry Pi GPIO library
from time import sleep, time # Import the sleep function from the time module
GPIO.setwarnings(False) # Ignore warning for now
GPIO.setmode(GPIO.BCM) # Use physical pin number
from getmac import get_mac_address
import json
from buzzerHandler import *
from bmeHandler import *
from ledHandler import *
from windSpeedHandler import *
from mqttHandler import *

StatusLED=LED(12,GPIO,GPIO.LOW)
buzzer = Buzzer(27)


wifi_mac = get_mac_address(interface="wlan0") 
wifi_mac=wifi_mac.replace(':','')
wifi_mac=wifi_mac.upper()
wifi_mac=wifi_mac.strip()
print('DEVICE MAC ADDRESS: ',wifi_mac)

while True:
    print('Humidity , Pressure , Temperature')
    bme280Vals=getBME280Data()
    data_set = {"macAddress":wifi_mac,"temperature":str(bme280Vals[2]) , "pressure": str(bme280Vals[1]),"humidity":str(bme280Vals[0]),"windSpeed":str(getWindSpeed()),"batteryLevel":"100"}
    json_dump = json.dumps(data_set)
    print(json_dump)
    # print(bme280Vals)
    StatusLED.ON()
    buzzer.on()
    sleep(1)
    StatusLED.OFF()
    buzzer.off()
    sleep(1)
    buzzer.beep()
    sleep(12)
    publishData('wsmdata/'+wifi_mac,str(json_dump))
    

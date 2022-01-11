

class LED:
   
    def __init__(self, pin,GPIO,initial):
        self.__PIN=pin
        self.__GPIO=GPIO
        
        self.__GPIO.setup(self.__PIN, self.__GPIO.OUT, initial=initial)

    def ON(self):
        self.__GPIO.output(self.__PIN, self.__GPIO.HIGH) 
    
    def OFF(self):
        self.__GPIO.output(self.__PIN, self.__GPIO.LOW) 
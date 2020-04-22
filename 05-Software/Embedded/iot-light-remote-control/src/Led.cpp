#include "Led.h"

//#include <Arduino.h>

Led::Led(){}

Led::Led(int _pin, unsigned int _brightness, bool _state)
{
	setPin(_pin);
	setBrightness(_brightness);
	setState(_state);
}

Led::~Led() {}

void Led::setPin(unsigned int _pin)
{
	pin = _pin;
}

void Led::setBrightness(unsigned int _brightness)
{
	brightness = _brightness;
}

void Led::setState(bool _state)
{
	isOn = _state;
}

unsigned int Led::getPin()
{
	return pin;
}

unsigned int Led::getBrightness()
{
	return brightness;
}

bool Led::getState()
{
	return isOn;
};

Leds::Leds()
{
	quantity = 0;
};

Leds::~Leds() {}

void Leds::add(int pin, unsigned int brightness, bool on)
{
	if (quantity < MAX_NUMBER_LEDS)
	{
		devs[quantity++] = Led(pin, brightness, on);
	}
}

void Leds::setBrightness(int led, int brightness)
{
	int index = findIndex(led);
	if (index > -1)
	{
		return devs[index].setBrightness(brightness);
	}
}

void Leds::setState(int led, bool state)
{
	int index = findIndex(led);
	if (index > -1)
	{
		return devs[index].setState(state);
	}
}

int Leds::getBrightness(int led)
{
	int index = findIndex(led);
	if (index > -1)
	{
		return devs[index].getBrightness();
	}
}

bool Leds::getState(int led)
{
	int index = findIndex(led);
	if (index > -1)
	{
		return devs[index].getState();
	}
}

int Leds::findIndex(int led)
{
	for (int i = 0; i < quantity; i++)
	{
		if (devs[i].getPin() == led)
			return i;
	}
	return -1;
}

int Leds::getQuantity()
{
	return quantity;
}

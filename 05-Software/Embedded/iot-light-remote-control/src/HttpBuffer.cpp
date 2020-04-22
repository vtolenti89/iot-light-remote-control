#include "HttpBuffer.h"
#include <Arduino.h>

HttpBuffer::HttpBuffer(unsigned int size):RingBuffer{size} {
	
}

HttpBuffer::~HttpBuffer(){
	
}

bool HttpBuffer::parseParam(const char * param, char * valueP)
{
	ringBufP = strstr(ringBuf, param);
	Serial.print("Params:");
	Serial.println(ringBuf);
	if (ringBufP)
	{
		ringBufP = ringBufP + strlen(param) + 1;
		while ((*ringBufP != ' ') && (*ringBufP != '\r') && (*ringBufP != '\n') && (*ringBufP != '&'))
		{
			*valueP = *ringBufP;
			ringBufP++;
			valueP++;
		}
		return true;
	}
	else
	{
		return false;
	}
}
